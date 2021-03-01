# Speech-Chess
Voice Command Chess Board utilizing Google's speech-to-text API and nodeJS

# Setup 
Requires yarn and node 

Follow quick setup with Googe Cloud: https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries

For API to work, must have SoX 14.4.1 installed and in your PATH environment variable: https://sourceforge.net/projects/sox/files/sox/14.4.1/

Install Chessboard JSX component as well as chess.js library for move validation 

>npm install chessboardjsx

>npm install chess.js 

# Running: 
Navigate to chess-stt directory and enter: 
>npm start

Then, in a separate terminal, navigate to api directory and enter:
>npm start

# NOTE: This will not work without setting up your own Google project or getting credentials from me 

