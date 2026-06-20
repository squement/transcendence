### Commit extension for more description after each commit

20.6.26 21h57
# Pong connected to the backend
Inclues:
Working Pong now fully connected to the backend, and communication between frontend and backend is set !!
Also, the game speed doesnt depend on the framerate anymore, now it will be running at the same speed for everyone, even if the framerate drops for one of the two players.
Next step:
- Merge with the main

19.6.26 18h38
# Pong added to the backend
Includes:
Working Pong with a new game_update.ts file that is in the backend folder so we can use it to play online later.
Next step:
- Connect back and front end Pong

17.6.26 14h45
# Base Websocket
Includes:
Working websocket system that currently send/responds and display a message every 2 seconds.
A test list shows online users in real time (handles connect and disconnect automatically).
The user list is a class defined in the backend.
A room classes system was added (non functional yet)
GameGateway added to help the pong front/back communication
Next Step:
- Display user profiles through websockets
- Join rooms with cookie defined id users
- Improve friendlist and status usage

15.6.26 21h58
# Base Profile display & Avatar
Includes:
A very basic react function that fetches (for now) user/0, displays it json format and fetches testing.png
Next Step:
- Add string avatar to user
- work on a simple format

13.6.26 21h11
Includes:
An almost fully working Pong with scores, collisions, accelerating ball, slightly randomized trajectory when the ball is bouncing on the paddles and the beginning of a win condition and the Game() function is easier to edit/use now
A basic testing area for the backend 'srcs/requirements/frontend/src'
A working dockerfile with 2 versions (dev and prod)
dev: should allow quick changes to react files
prod: the better version to submit, lightweight and protected
A dockercompose that requires a target change to use either dockerfile mods
A connection between front and back was established using 'fetch(/backend/greet/from backend)'
Next Step:
- start using configfiles
- allow a Pong game to end

11.6.26 18h01
Includes:
An almost fully working Pong with scores, collisions, accelerating ball, slightly randomized trajectory when the ball is bouncing on the paddles and the beginning of a win condition
A basic testing area for the backend 'srcs/requirements/frontend/src'
A working dockerfile with 2 versions (dev and prod)
dev: should allow quick changes to react files
prod: the better version to submit, lightweight and protected
A dockercompose that requires a target change to use either dockerfile mods
A connection between front and back was established using 'fetch(/backend/greet/from backend)'
Next Step:
- start using configfiles
- optimize Game.jsx to make it easier to connect to the backend

15.6.26 19h04
# Front & Back communication
Includes:
'backend/src/user' which allows the usage of a Array[User] using fetch(/backend/user)
returns the class instance as a json
variables can be get and updated (post) using postAny / postJson or getAny
Next Step:
- installation and link to real database
- Fix react image overlap

9.6.26 17h16
# Backend Addition
Includes:
A basic testing area for the backend 'srcs/requirements/frontend/src'
A working dockerfile with 2 versions (dev and prod)
dev: should allow quick changes to react files
prod: the better version to submit, lightweight and protected
A dockercompose that requires a target change to use either dockerfile mods
A connection between front and back was established using 'fetch(/backend/greet/from backend)'
Next Step:
V 15.6.26 19h04 - start using ~~configfiles~~ classes and json

8.6.26 18h34
# Frontend Addition
Includes:
Push includes basic react testing field in 'srcs/requirements/frontend/src'
A working dockerfile with 2 versions (dev and prod)
dev: should allow quick changes to react files
prod: the better version to submit, lightweight and protected behind nginx
A dockercompose that requires a target change to use either dockerfile mods (instructions given there)
A working first version of Pong without anything more than : Pong. (no score no nothing)
Next Step:
V 9.6.26 16h48 - adding basic backend usage (minimal testing area)