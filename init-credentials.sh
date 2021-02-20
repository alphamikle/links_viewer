filename="credentials.json5"
templateFilename="credentials-template.json5"
filepath="./$filename"
templateFilepath="./$templateFilename"

if test -f "$filepath"; then
    echo "Config file $filename already exist"
else
  cp "$templateFilepath" "$filepath"
  echo "Config file $filename currently created"
fi