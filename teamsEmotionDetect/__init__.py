import logging

import azure.functions as func
import asyncio
import io
import glob
import os
import sys
import time
import uuid
import requests
import numpy as np
import base64
# from urllib.parse import urlparse
# from io import BytesIO
from PIL import Image, ImageDraw
from azure.cognitiveservices.vision.face import FaceClient
from msrest.authentication import CognitiveServicesCredentials
from azure.cognitiveservices.vision.face.models import TrainingStatusType, Person, SnapshotObjectType, OperationStatusType, FaceAttributeType
import pyodbc
KEY = '82e0543ad88543348c8f9e5e03ec68cc'

# Set the FACE_ENDPOINT environment variable with the endpoint from your Face service in Azure.
# This endpoint will be used in all examples in this quickstart.
ENDPOINT = 'https://faceapiabrastog.cognitiveservices.azure.com'

def add_to_database(faceResponse, user):
    # add data to database
    # retrieve the value for user
    # add the average
    # push back to database.
    try:

        server = 'abrastogserver.database.windows.net'
        database = 'attentiveness'
        username = 'abhirastogi1910'
        password = '@bhisheK123'
        driver= '{ODBC Driver 17 for SQL Server}'
        cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
        cursor = cnxn.cursor()
        cursor.execute("SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid")
        cursor.execute("SELECT * FROM emotions WHERE username = user")
        row = cursor.fetchone()
        print (str(row[0]) + " " + str(row[1]))
    except pyodbc.Error as err:
        logging.error(err)
        raise

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        face_client = FaceClient(ENDPOINT, CognitiveServicesCredentials(KEY))
        for input_file in req.files.values():
            filename = input_file.filename
            contents = input_file.stream.read()
            image = Image.open(io.BytesIO(contents))
            logging.info(image)
            face_details = face_client.face.detect_with_stream(io.BytesIO(contents), False, True, return_face_attributes = list([FaceAttributeType.emotion]))
            add_to_database(face_details[0], '123')
            # face_client.face.detect_with_stream(image, false, True, list[FaceAttributeType.emotion])
            # add to database.
        
        # print (req_body)
        # image = req.params.get('File1')

    except Exception as e:
        logging.error(e)
        pass
    else:
        pass
        # name = req_body.get('name')

    # if name:
    #     return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    # else:
    #     return func.HttpResponse(
    #          "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
    #          status_code=200
    #     )
