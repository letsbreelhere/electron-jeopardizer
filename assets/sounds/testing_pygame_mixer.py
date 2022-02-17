
"""
DID NOT PLAY ANY SOUND AT ALL
from pygame import mixer

mixer.init()

sound = mixer.Sound("final_jeopardy.wav")
sound.play
"""

"""
Threw an error
from playsound import playsound

playsound("final_jeopardy.wav")
"""

import simpleaudio as sa

filename = "daily_double.wav"
wave_obj = sa.WaveObject.from_wave_file(filename)
play_obj = wave_obj.play()
play_obj.wait_done()