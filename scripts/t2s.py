# from gtts.lang import tts_langs

# # Get the list of supported languages
# languages = tts_langs()

# # Print the languages in a readable format
# for code, name in languages.items():
#     print(f"{code}: {name}")
from gtts import gTTS  

text = "Sannu, yaya kake?"  # Hello, how are you?  
language = "ha"  # Hausa language code  

tts = gTTS(text=text, lang=language, slow=False)
tts.save("hello_hausa.mp3")  # Save the audio file  