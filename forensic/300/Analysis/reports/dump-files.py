#!/usr/bin/env python2

import json

reportFile = open('./report.json', 'rb')
reportJson = json.loads(reportFile.read())
reportFile.close()

callsArray = reportJson.get('behavior').get('processes')[1].get('calls')

for callIndex in range(0, len(callsArray)):
    call = callsArray[callIndex]
    callname = call.get('api')
    #if (callname == 'NtReadFile' or callname == 'NtWriteFile'):
    args = call.get('arguments')
    #if (args and (args.get('file_handle') == '0x000000bc')):
    data = args.get('buffer')
    if (data):
        f = open('./files/' + str(callIndex), 'wb')
        f.write(data.encode('utf8'))
        f.close()
