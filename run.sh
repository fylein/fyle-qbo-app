source /fyle-qbo-app/setup.sh

if [[ $OSTYPE == darwin* ]]
then
  SED_EXTRA_ARGS='""';
fi

for f in /usr/share/nginx/html/*
do
    echo "Substituting Environment variables and other stuff in $f ...";
    sed -i $SED_EXTRA_ARGS "s?{{API_URL}}?${API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{APP_URL}}?${APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_APP_URL}}?${FYLE_APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{NEW_QBO_APP_URL}}?${NEW_QBO_APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{CALLBACK_URI}}?${CALLBACK_URI}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_CLIENT_ID}}?${FYLE_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_URL}}?${FYLE_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{PRODUCTION}}?${PRODUCTION}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_APP_URL}}?${QBO_APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_AUTHORIZE_URI}}?${QBO_AUTHORIZE_URI}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_CLIENT_ID}}?${QBO_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_SCOPE}}?${QBO_SCOPE}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{HOTJAR_ID}}?${HOTJAR_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SEGMENT_ID}}?${SEGMENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SENTRY_DSN}}?${SENTRY_DSN}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{RELEASE}}?${RELEASE}?g" $f;
    
done

nginx -g "daemon off;"