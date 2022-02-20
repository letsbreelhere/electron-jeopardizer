import board
import digitalio
import time
import usb_hid
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS
from adafruit_hid.keycode import Keycode

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT

BOARD_PINS = [
    board.GP0,
    board.GP1,
    board.GP2,
    board.GP4,
]

def setupBuzzer(p):
    pin = digitalio.DigitalInOut(p)
    pin.direction = digitalio.Direction.INPUT
    pin.pull = digitalio.Pull.UP
    return pin

PINS = list(map(setupBuzzer, BOARD_PINS))

OUTPUTS = [
    Keycode.F1,
    Keycode.F2,
    Keycode.F3,
    Keycode.F4
]

time.sleep(1)  # Sleep for a bit to avoid a race condition on some systems
keyboard = Keyboard(usb_hid.devices)
keyboard_layout = KeyboardLayoutUS(keyboard)

PIN_HISTORIES = {
}

while True:
    # led.value = not pin.value
    for pin in range(4):
        newVal = PINS[pin].value
        if newVal != PIN_HISTORIES.get(pin, True):
            PIN_HISTORIES[pin] = newVal
            if not newVal:
                keyboard.press(OUTPUTS[pin])
                keyboard.release_all()
    time.sleep(.01)
