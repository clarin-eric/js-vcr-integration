#!/bin/bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

NPM_SCRIPT='pack'

for ARG in "$@"
do
    case "${ARG}" in
        --dev)
            echo "Building in development mode"
            NPM_SCRIPT='pack-dev'
            ;;
        *)
            echo "Unknown argument: ${ARG}"
            exit 1
            ;;
    esac
done

if ! [ -d "${SCRIPT_DIR}/node_modules" ]; then
	echo "Node modules directory not found: installing dependencies..."
	(cd "${SCRIPT_DIR}" && npm install)
fi


(cd "${SCRIPT_DIR}" && npm run "${NPM_SCRIPT}")
