import logging

import azure.functions as func
from azure.cosmos import cosmos_client, partition_key, errors
import uuid
import asyncio
import io
import time
import glob
import os
import json
import sys
import time
import requests
import base64
from io import BytesIO
from PIL import Image, ImageDraw
from azure.cognitiveservices.vision.face import FaceClient
from msrest.authentication import CognitiveServicesCredentials
from azure.cognitiveservices.vision.face.models import TrainingStatusType, Person, SnapshotObjectType, OperationStatusType, FaceAttributeType
import pyodbc
FACE_KEY = '953820ade75f428d99e1b8d3a9e8d4e3'
FACE_ENDPOINT = 'https://emotionsapi.cognitiveservices.azure.com/'

COSMOS_KEY = '00zYYVNQuIKzPXm0lCNzF6ZYW8NnQtx0LcM185jmimftNiGkDDS58g90Hp38nAJawUfCINiD9JUx68HKaU1Dgw=='
COSMOS_ENDPOINT = 'https://faceemotionsdb.documents.azure.com:443/'

def get_mean_emotion(existingEmotion, newEmotion, iteration):
    emotion_sum = existingEmotion * iteration + newEmotion
    return emotion_sum / (iteration+1)

def get_student_record(faceEmotions, user, userName):
    return {
        'userid': user,
        'username': userName,
        'happiness': faceEmotions.happiness,
        'anger': faceEmotions.anger,
        'sadness': faceEmotions.sadness,
        'neutral': faceEmotions.neutral,
        'contempt': faceEmotions.contempt,
        'disgust': faceEmotions.disgust,
        'surprise': faceEmotions.surprise,
        'fear': faceEmotions.fear
    }

def get_container_link():
    
    database_name = 'emotions'
    container_name = 'studentEmotions'
    collection_link = "dbs/"+database_name+"/colls/"+container_name
    return collection_link

def add_to_database(studentRecord):
    try:

        cosmos_cli = cosmos_client.CosmosClient(url_connection=COSMOS_ENDPOINT, auth={"masterKey":COSMOS_KEY})
        collection_link = get_container_link()
        container = cosmos_cli.ReadContainer(collection_link)
        query = "SELECT * FROM c WHERE c.userid = '{0}'".format(studentRecord['userid'])
        records = list(cosmos_cli.QueryItems(
            database_or_Container_link = container["_self"],
            query=query,
            options={'enableCrossPartitionQuery': True}
        ))
        if len(records) == 0:
            studentRecord['iteration'] = 1
            cosmos_cli.CreateItem(
                database_or_Container_link = container["_self"],
                document = studentRecord
            )
        else :
            existingRecord = records[0]
            iteration = existingRecord['iteration']

            studentRecord['happiness'] = get_mean_emotion(existingRecord['happiness'], studentRecord['happiness'], iteration)
            studentRecord['anger'] = get_mean_emotion(existingRecord['anger'], studentRecord['anger'], iteration)
            studentRecord['sadness'] = get_mean_emotion(existingRecord['sadness'], studentRecord['sadness'], iteration)
            studentRecord['neutral'] = get_mean_emotion(existingRecord['neutral'], studentRecord['neutral'], iteration)
            studentRecord['contempt'] = get_mean_emotion(existingRecord['contempt'], studentRecord['contempt'], iteration)
            studentRecord['disgust'] = get_mean_emotion(existingRecord['disgust'], studentRecord['disgust'], iteration)
            studentRecord['surprise'] = get_mean_emotion(existingRecord['surprise'], studentRecord['surprise'], iteration)
            studentRecord['fear'] = get_mean_emotion(existingRecord['fear'], studentRecord['fear'], iteration)
            studentRecord['iteration'] = iteration+1
            studentRecord['id']=existingRecord['id']
            cosmos_cli.ReplaceItem(
                document_link = existingRecord['_self'],
                new_document = studentRecord
            )
        
    except errors.HTTPFailure as err:
        logging.error(err)
        raise

def main(req: func.HttpRequest) -> func.HttpResponse:
    if(req.method == 'POST'):
        try:
            face_client = FaceClient(FACE_ENDPOINT, CognitiveServicesCredentials(FACE_KEY))
            for input_file in req.files.values():
                filename = input_file.filename
                contents = input_file.stream.read()
                image = Image.open(io.BytesIO(contents))
                face_details = face_client.face.detect_with_stream(io.BytesIO(contents), False, True, return_face_attributes = list([FaceAttributeType.emotion]))
                userid = req.form['user']
                userName = req.form['name']
                if len(face_details) > 0:
                    student_item = get_student_record(face_details[0].face_attributes.emotion, userid, userName)
                    add_to_database(student_item)

        except Exception as e:
            logging.error(e)
            pass
        else:
            pass
        return func.HttpResponse(
            status_code=200
        )
    else:
        try:
            cosmos_cli = cosmos_client.CosmosClient(url_connection=COSMOS_ENDPOINT, auth={"masterKey":COSMOS_KEY})
            collection_link = get_container_link()
            container = cosmos_cli.ReadContainer(collection_link)
            currentDateEpoch = int(time.time()) - 10
            logging.info("Current epoch time  :" + str(int(time.time())))
            logging.info("Fetching for epoch greater than:" + str(currentDateEpoch))
            query = "SELECT * FROM c WHERE c._ts > {0}".format(str(currentDateEpoch))
            records = list(cosmos_cli.QueryItems(
                database_or_Container_link = container["_self"],
                query=query,
                options={'enableCrossPartitionQuery': True}
            ))
            response = [{
                'user':record['userid'],
                'name': record['username'],
                'happiness': record['happiness'],
                'anger': record['anger'],
                'sadness': record['sadness'],
                'neutral': record['neutral'],
                'contempt': record['contempt'],
                'disgust': record['disgust'],
                'surprise': record['surprise'],
                'fear': record['fear']
            } for record in records]
            return func.HttpResponse(
                body=json.dumps(response),
                status_code=200,
                mimetype="application/json",
                headers= {
                    'Access-Control-Allow-Origin' : '*'
                }
            )
        except Exception as e:
            logging.error(e)
            pass
        else:
            pass
        



