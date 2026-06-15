### Commit extension for more description after each commit

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