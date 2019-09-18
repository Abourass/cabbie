#!/usr/bin/env bash
cp vocab-German.sh "$HOME/vocab-German.sh"
cp .vocab-script.sh "$HOME/.vocab-script.sh"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
	OSBASHRC=bashrc
elif [[ "$OSTYPE" == "darwin"* ]]; then
	OSBASHRC=bash_profile
fi
if ! grep -Fxq "$HOME/.vocab-German.sh" ~/.$OSBASHRC; then
	echo $"\n$HOME/.vocab-German.sh" >> ~/.$OSBASHRC
fi

OSBASHRC="zshrc"
if [[ -f ~/.$OSBASHRC ]]; then
	if ! grep -Fxq "$HOME/.vocab-German" ~/.$OSBASHRC; then
		echo $"\n$HOME/.vocab-German" >> ~/.$OSBASHRC
	fi
fi

echo $"chmod u+x $HOME/.vocab-German.sh"
echo $"chmod u+x $HOME/.vocab-script.sh"