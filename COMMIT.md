### Commit extension for more description after each commit

8.6.26 17h17
Includes:
First push includes basic react testing field in 'srcs/requirements/frontend/src'
A working dockerfile with 2 versions (dev and prod)
dev: should allow quick changes to react files, is missing the volumes to ensure said usage
prod: the better version to submit, lightweight and protected behind nginx
A dockercompose that requires a target change to use either dockerfile mods (instructions given there)
Next Step:
- adding volumes for a working real time dev
- adding basic backend usage (minimal testing area)