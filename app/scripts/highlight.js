function highlightModelsBasedOnQuery(query) {
    const models = {
        baikal: document.getElementById("model_baikal"),
        stonk: document.getElementById("model_stonk"),
        swan: document.getElementById("model_swan"),
        bocka: document.getElementById("model_bocka"),
        buben: document.getElementById("model_buben"),
        b_mask: document.getElementById("model_b_mask"),
        e_mask: document.getElementById("model_e_mask"),
        medal: document.getElementById("model_medal"),
        tabl: document.getElementById("model_tabl"),
        noz: document.getElementById("model_noz"),
        deer: document.getElementById("model_deer"),
        fish: document.getElementById("model_fish"),
        plet: document.getElementById("model_plet"),
        weap: document.getElementById("model_weap"),
        luk: document.getElementById("model_luk"),
        ice: document.getElementById("model_ice"),
        seal: document.getElementById("model_seal"),
        flower: document.getElementById("model_flower"),
        trash: document.getElementById("model_trash"),
        sputnik: document.getElementById("model_sputnik"),
        buzzy: document.getElementById("model_buz"),
        bread: document.getElementById("model_bread"),
        ski: document.getElementById("model_ski"),
        sleds: document.getElementById("model_sleds"),
        earth: document.getElementById("model_earth"),
        obj: document.getElementById("model_obj")
    };

    // Функция для установки подсветки и анимации
    function highlightModel(model, highlight = true) {
        if (!model) return;
    
        const mesh = model.getObject3D("mesh");
        if (mesh) {
            mesh.traverse(node => {
                if (node.isMesh) {
                    // Устанавливаем emissive цвет на красный, но не меняем основной цвет материала
                    node.material.emissive = new THREE.Color(highlight ? "#FF0000" : "#000000");
                    node.material.emissiveIntensity = highlight ? 0.1 : 0; // Уменьшаем интенсивность, чтобы не перекрывать основной цвет
                }
            });
        }
    
        // Добавляем или удаляем анимацию
        if (highlight) {
            // Сохраняем исходную позицию модели
            const basePosition = model.getAttribute("position");
            const basePositionX = basePosition.x;
            const basePositionY = basePosition.y;
            const basePositionZ = basePosition.z;

            // Вычисляем новую позицию по оси Z (немного выше)
            const raisedPositionY = basePositionY + 0.2; // Поднимаем на 0.2 единицы по Z

            // Добавляем анимацию поднятия и опускания
            model.setAttribute("animation", {
                property: "position",
                to: `${basePositionX} ${raisedPositionY} ${basePositionZ}`,
                from: `${basePositionX} ${basePositionY} ${basePositionZ}`,
                dur: 1500, // Длительность анимации поднятия (1.5 секунды)
                easing: "easeInOutSine", // Плавное ускорение и замедление
            });

            // Обработчик завершения первой анимации (поднятие)
            model.addEventListener('animationcomplete', () => {
                // Добавляем анимацию опускания
                model.setAttribute("animation", {
                    property: "position",
                    to: `${basePositionX} ${basePositionY} ${basePositionZ}`,
                    from: `${basePositionX} ${raisedPositionY} ${basePositionZ}`,
                    dur: 1500, // Длительность анимации опускания (1.5 секунды)
                    easing: "easeInOutSine", // Плавное ускорение и замедление
                });

                // Обработчик завершения второй анимации (опускание)
                model.addEventListener('animationcomplete', () => {
                    // Убираем анимацию после завершения
                    model.removeAttribute("animation");
                }, { once: true }); // Обработчик сработает только один раз
            }, { once: true }); // Обработчик сработает только один раз
        } else {
            // Убираем анимацию и возвращаем базовую позицию
            model.removeAttribute("animation");
            const basePosition = model.getAttribute("position");
            model.setAttribute("position", basePosition); // Возвращаем исходную позицию
        }
    }

    // Сброс подсветки и анимации у всех моделей
    Object.values(models).forEach(model => highlightModel(model, false));

    // Подсветка на основе ключевых слов
    Object.entries(keywords).forEach(([modelId, keywordsList]) => {
        if (keywordsList.some(keyword => query.toLowerCase().includes(keyword))) {
            highlightModel(models[modelId], true);
        }
    });
}