
from flask import Flask,render_template;
app = Flask(__name__)

@app.route("/")
def functio():
        # return render_template("index.html")   //this is used to take the frontend into out app
    return "hello world"

if __name__ == "__main__":
    app.run(debug=True,port=8000)