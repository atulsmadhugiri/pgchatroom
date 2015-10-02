.PHONY: build serve

WEBPACK=node_modules/webpack/bin/webpack.js
WEBPACK_DEV_SERVER=node_modules/webpack-dev-server/bin/webpack-dev-server.js

BLUE=\033[0;34m
NOCOLOR=\033[0m

PORT=8080

help:
	@echo "make serve # runs the server (port 8080 by default)"
	@echo "make build # bundles javascript"

build:
	@echo "${BLUE}Bundling Javascript, results are in build/${NOCOLOR}"
	@echo "${BLUE}========${NOCOLOR}"
	${WEBPACK}

serve:
	@echo "${BLUE}Starting server on port ${PORT}.${NOCOLOR}"
	@echo "${BLUE}Navigate to localhost:${PORT}/webpack-dev-server/ to use hot reloader.${NOCOLOR}"
	@echo "${BLUE}========${NOCOLOR}"
	${WEBPACK_DEV_SERVER} --port ${PORT} -d --hot --inline
