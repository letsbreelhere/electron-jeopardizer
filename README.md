# The Electron Jeopardizer

This is a desktop app for playing Jeopardy games at home. It is (so far)
essentially a rewrite of a friend's project, which was based on PyQt and runs on
a Raspberry Pi. I rewrote it in [electron](https://www.electronjs.org/) to make the app more easily
distributable and usable by people who aren't programmers. It's also meant to
be runnable on just about any desktop, thanks to a change in the hardware.
In the original version, buzzers were connected directly to the Pi's GPIO pins,
and accessed using the Python libraries for GPIO available on the Pi. This
version intends to use buzzers connected to an
[RP2040](https://www.raspberrypi.com/products/rp2040/), which can act as either
a USB serial device or HID to send buzzer state to the app. The `buzzer_box`
directory contains what's needed there - after [installing
CircuitPython](https://learn.adafruit.com/getting-started-with-raspberry-pi-pico-circuitpython/circuitpython),
just drop the contents of `buzzer_box` into the mass storage volume it creates.
