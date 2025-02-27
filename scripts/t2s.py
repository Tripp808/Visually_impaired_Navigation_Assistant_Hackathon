# from gtts.lang import tts_langs

# # Get the list of supported languages
# languages = tts_langs()

# # Print the languages in a readable format
# for code, name in languages.items():
#     print(f"{code}: {name}")
from gtts import gTTS  

text = "Elimu ni ufunguo wa maisha, na bidii huleta mafanikio."   
language = "sw"  # swahilli language code  

tts = gTTS(text=text, lang=language, slow=False)
tts.save("swahilli.mp3")   