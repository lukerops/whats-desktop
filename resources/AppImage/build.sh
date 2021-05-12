#!/bin/sh

BUILD_ELECTRON_PATH="build/dist/WhatsDesktop-linux-x64"
APPIMAGE_PATH="build/AppDir"
APPIMAGE_RESOURCES="resources/AppImage"

rm -rf $APPIMAGE_PATH
mkdir -p ${APPIMAGE_PATH}/usr/share/whats-desktop

# Copy files
cp -R $BUILD_ELECTRON_PATH/* ${APPIMAGE_PATH}/usr/share/whats-desktop

# Copy icons
{
	for size in 16 24 48 64 128 256 512; do
		ICON_PATH=${APPIMAGE_PATH}/usr/share/icons/hicolor/${size}x${size}/apps
		mkdir -p $ICON_PATH
		cp resources/icon/icon-${size}x${size}.png ${ICON_PATH}/whats-desktop.png
	done
	ICON_PATH=${APPIMAGE_PATH}/usr/share/icons/hicolor/scalable/apps
	mkdir -p $ICON_PATH
	cp resources/icon/icon.svg ${ICON_PATH}/whats-desktop.svg
}
cp ${APPIMAGE_PATH}/usr/share/icons/hicolor/256x256/apps/whats-desktop.png ${APPIMAGE_PATH}/

cp ${APPIMAGE_RESOURCES}/AppRun $APPIMAGE_PATH
cp ${APPIMAGE_RESOURCES}/whats-desktop.desktop $APPIMAGE_PATH

VERSION=$(cat package.json | grep version | cut -d '"' -f4)

wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage -O build/appimagetool-x86_64.AppImage
chmod +x build/appimagetool-x86_64.AppImage
./build/appimagetool-x86_64.AppImage \
	$APPIMAGE_PATH -n \
	-u "gh-releases-zsync|lucasscvvieira|kitty-appimage|stable|Kitty*.AppImage.zsync" \
	"WhatsDesktop-$VERSION-x86_64.AppImage"
chmod +x WhatsDesktop*.AppImage

mkdir -p build/dist/installers/
mv WhatsDesktop*.AppImage* build/dist/installers/
