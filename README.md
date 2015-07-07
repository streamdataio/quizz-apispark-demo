# Quizz APISpark - Streamdata.io demo

This demo shows how to turn an APISpark API into a streaming API thanks to [streamdata.io](http://streamdata.io/). For 
further reading, you can read the blog entry explanation at [restlet](http://restlet.com/blog/2015/07/08/create-a-quiz-application-with-google-sheets-apispark-streamdata-io-and-d3-js/).

## Steps

1. Create a Google Sheet with your Quizz questions and answers as described at [TODO add the url]
2. Create an APISpark account at http://restlet.com/products/apispark/ to expose the Web API of the Quizz as described at [TODO add the url]
3. Create a streamdata.io account to get your streamdata.io app token at https://portal.streamdata.io/ in order to turn
the Vote API into a streaming API
4. Replace the placeholders in the `app.js` with your APISpark credentials of your Quizz Web API and your streamdata.io app token
5. Launch the app with your favorite server
  * the simplest way, if Python is installed on your machine, is the executing the command `python -m SimpleHTTPServer 8080` 
  * if you are an npm afficionados, you can use http-server
  
  ```
  npm install http-server
  node_modules/http-server/bin/http-server .
  ```  

6. Open your favorite browser (works with Chrome, Firefox, Safari, and IE 10+) at `http://localhost:8080`

You are done! You can now enjoy your quizz! Charts get updated automatically as the people answer the quizz.
