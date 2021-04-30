namespace localExtensions {
    //% block="draw %text in %picture=variables_get(picture) x %originX y %originY color %color=colorindexpicker"
    //% text.defl="hello"
    //% color.defl=1
    export function drawText5In(
        text: string,
        picture: Image,
        originX: number,
        originY: number,
        color: number
    ) {
        picture.print(text, originX, originY, color, image.font5);
    }

    //% block="ask %text for number between %low and %high with initial %initial"
    export function askForNumber(text: string, low: number, high: number, initial: number) {
        game.pushScene();

        const paddingX = 8;
        const paddingY = 8;
        const inputOffset =
            paddingX + image.font8.charWidth * (text.length !== 0 ? text.length + 1 : 0);

        let s = sprites.create(image.create(160, 120));
        s.left = 0;
        s.top = 0;

        drawStaticContent(s.image, text, paddingX, paddingY);

        let handleDown = createButtonPressHandler(controller.down);
        let handleUp = createButtonPressHandler(controller.up);
        let handleLeft = createButtonPressHandler(controller.left);
        let handleRight = createButtonPressHandler(controller.right);
        let handleA = createButtonPressHandler(controller.A);

        let done = false;
        let selected = Math.constrain(initial, low, high);

        game.onUpdate(function () {
            drawDynamicContent(s.image, low, high, selected, inputOffset, paddingY);

            const up = handleUp();
            const right = handleRight();
            const down = handleDown();
            const left = handleLeft();
            const aButton = handleA();

            if (up || right) {
                selected = Math.min(selected + 1, high);
            }
            if (down || left) {
                selected = Math.max(selected - 1, low);
            }
            if (aButton) {
                done = true;
            }
        });

        pauseUntil(() => done);
        s.destroy();

        game.popScene();

        return selected;
    }

    function drawStaticContent(dest: Image, text: string, paddingX: number, paddingY: number) {
        dest.print(text, paddingX, paddingY, 1, image.font8);
        dest.drawTransparentImage(
            aLogo,
            screen.width - aLogo.width - 4 - image.font8.charWidth * 2 - paddingX,
            screen.height - aLogo.height - paddingY + /* baseline adjustment */ 1
        );
        dest.print(
            'OK',
            screen.width - image.font8.charWidth * 2 - paddingX,
            screen.height - image.font8.charHeight - paddingY,
            1,
            image.font8
        );
    }

    function drawDynamicContent(
        dest: Image,
        low: number,
        high: number,
        selected: number,
        offsetX: number,
        paddingY: number
    ) {
        dest.fillRect(
            offsetX - 1,
            paddingY - 1,
            image.font8.charWidth * Math.max(`${low}`.length, `${high}`.length) + 2,
            image.font8.charHeight + 2,
            0
        );
        dest.fillRect(
            offsetX - 1,
            paddingY - 1,
            image.font8.charWidth * `${selected}`.length + 2,
            image.font8.charHeight + 2,
            1
        );
        dest.print(`${selected}`, offsetX, paddingY, 15);
    }

    // logic inspired by https://github.com/microsoft/pxt-common-packages/blob/e651caeba255177ea6f64bd02bdd25612eede1bd/libs/game/textDialogs.ts#L493-L514
    function createButtonPressHandler(button: controller.Button) {
        let handled = true;
        return function () {
            let pressed = button.isPressed();
            if (pressed && !handled) {
                handled = true;
                return true;
            } else if (handled && !pressed) {
                handled = false;
            }
            return false;
        };
    }

    // borrowed from https://github.com/microsoft/pxt-common-packages/blob/e4b148bb471e8553f0ca27dade72ca1c2869c97e/libs/game/textDialogs.ts#L595-L621
    const aLogo = img`
        0 0 0 6 6 6 6 6 0 0 0
        0 6 6 7 7 7 7 7 6 6 0
        0 6 7 7 1 1 1 7 7 6 0
        6 7 7 1 7 7 7 1 7 7 6
        6 7 7 1 7 7 7 1 7 7 6
        6 7 7 1 1 1 1 1 7 7 6
        6 6 7 1 7 7 7 1 7 6 6
        8 6 6 1 7 7 7 1 6 6 8
        8 6 6 7 6 6 6 7 6 6 8
        0 8 6 6 6 6 6 6 6 8 0
        0 0 8 8 8 8 8 8 8 0 0
    `;
}
