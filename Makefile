.PHONY: build serve

BLUE=\033[0;34m
NOCOLOR=\033[0m

PORT=8080

help:
	@echo "make serve # runs the server (port 8080 by default)"
	@echo "make build # bundles javascript"

build:
	@echo "${BLUE}Bundling Javascript, results are in build/${NOCOLOR}"
	@echo "${BLUE}========${NOCOLOR}"
	webpack

serve:
	@echo "${BLUE}Starting server on port ${PORT}.${NOCOLOR}"
	@echo "${BLUE}Navigate to localhost:${PORT}/webpack-dev-server/ to use hot reloader.${NOCOLOR}"
	@echo "${BLUE}========${NOCOLOR}"
	webpack-dev-server --port ${PORT} -d --hot --inline
