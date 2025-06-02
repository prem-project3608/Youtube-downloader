from flask import Flask, render_template, request, send_file
from pytube import YouTube
import os

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url = request.form['url']
        format_type = request.form['format']
        try:
            yt = YouTube(url)
            title = yt.title.replace(" ", "_")

            if format_type == 'audio':
                stream = yt.streams.filter(only_audio=True).first()
                filepath = stream.download(filename=f"{title}.mp3")
            else:
                stream = yt.streams.get_highest_resolution()
                filepath = stream.download(filename=f"{title}.mp4")

            return send_file(filepath, as_attachment=True)

        except Exception as e:
            return f"Error: {str(e)}"

    return render_template('index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
