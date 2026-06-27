.PHONY: install dev build test lint deploy deploy-preview open

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

deploy: build
	netlify deploy --prod --dir=.next

deploy-preview: build
	netlify deploy --dir=.next

open:
	netlify open
