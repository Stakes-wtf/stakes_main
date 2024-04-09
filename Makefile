include .env

test:
	anchor test -- --features testing

build-dev:
	anchor build -- --features testing

deploy-dev:
	anchor deploy --provider.cluster ${RPC_URL} -p stakes-wtf --program-keypair ./keypairs/program.json

close-buffers:
	solana program close --buffers --url ${RPC_URL}