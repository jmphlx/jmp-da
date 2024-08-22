#!/bin/bash
ACTIVATE_MODE="preview" #could also be 'live' for publishing
PREVIEW_LIST=""
API_KEY=""
OWNER="jmp-hlx"
REPO="jmp-da"
REF="main"
#for PATH in ${PREVIEW_LIST}; do
while read -r path; do
    echo "Preview request sent for ${path}"
    curl https://admin.hlx.page/${ACTIVATE_MODE}/${OWNER}/${REPO}/${REF}/${path} -H "authorization: token $API_KEY"
done < "${PREVIEW_LIST}"
