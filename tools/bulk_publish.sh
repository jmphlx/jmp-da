#!/bin/bash
ACTIVATE_MODE="preview" #could also be 'live' for publishing
PREVIEW_LIST=""
API_KEY=""
OWNER="jmp-hlx"
REPO="jmp-da"
REF="main"
#for PATH in ${PREVIEW_LIST}; do
while read -r path; do
    RESPONSE_CODE=`curl https://admin.hlx.page/${ACTIVATE_MODE}/${OWNER}/${REPO}/${REF}/${path} -w "%{http_code}" -H "authorization: token $API_KEY"`
    echo "${ACTIVATE_MODE} request sent for ${path}, response code: ${RESPONSE_CODE}"
done < "${PREVIEW_LIST}"
