// Russian strings are stable lookup keys, never CSS class names.
const AuroraI18n = (() => {
  const english = {
    Все: "All",
    Пиковые: "Peak",
    Плашки: "Background",
    "Внутри букв": "Inside letters",
    "Боевая форма": "Battle form",
    Буквенные: "Per letter",
    "Одежда для твоих слов": "Dress your words in light",
    "Наведи или выбери стиль. Предпросмотр показывает твой текст; заметка изменится только после «Применить».":
      "Hover or select a style to preview your text. Your note changes only when you apply it.",
    "Найти: Luna, Tw, внутри букв…": "Search: silver, Luna, inside letters…",
    "Найти стиль": "Find a style",
    "Группы стилей": "Style groups",
    "Ничего не найдено. Попробуй другое имя.": "No results. Try another name.",
    "Совет: выделяй слова и короткие фразы без Markdown-разметки. Вид тегов в редакторе зависит от режима Obsidian.":
      "Select plain words or short phrases. HTML tags may be visible in the editor, depending on the editing mode.",
    Отмена: "Cancel",
    "Снять оформление": "Remove style",
    Применить: "Apply",
    "Выразительное имя": "Emphasize name",
    "Без движения": "Still",
    "Компактная плашка": "Compact background",
    Медленнее: "Slower",
    "Прозрачные пряди": "Subtle strands",
    "Короткие пряди": "Short strands",
    "Хаотично менять буквы": "Chaotic letter changes",
    "Применить · ": "Apply · ",
    "Цвет пульса ": "Pulse color ",
    "Новый характер букв": "Reshuffle letters",
    "Aurora · Стили текста": "Aurora · Text styles",
    "Найти стиль…": "Find a style…",
    "Поиск стиля": "Search styles",
    "Стили — прокрутка колёсиком": "Styles — scroll with the wheel",
    "Ничего не найдено": "No results",
    "Большая палитра…": "Full palette…",
    "Оформить выделенный текст · большая палитра":
      "Style selected text: full palette",
    "Снять оформление Aurora": "Remove Aurora style",
    "Поставь курсор внутри оформленного текста.":
      "Place the cursor inside styled text.",
    "Пока поддерживается одно выделение за раз.":
      "Select one text range at a time.",
    "Aurora · Выбрать стиль": "Aurora · Choose a style",
    "Выбор стиля по правой кнопке": "Context menu picker",
    "Изменение действует сразу, без перезапуска. В подменю стиль применяется щелчком по строке.":
      "Changes take effect immediately. Click a compact menu row to apply its style.",
    "Компактный столбец справа": "Compact submenu",
    "Большая палитра с предпросмотром": "Full preview palette",
    "Анимация при наведении в подменю": "Animate hovered menu sample",
    "Движется только образец под мышью, остальные неподвижны.":
      "Only the sample under your pointer animates. Other rows remain still.",
    "42 стиля, в том числе 9 пиковых. Список листается колёсиком, а не движением мыши. Большая палитра остаётся доступна внизу подменю и через Ctrl+P. В узком окне Obsidian может раскрыть подменю влево, чтобы оно поместилось.":
      "42 styles, including 9 peak presets. Scroll the list with the wheel. Open the full palette from the submenu footer or command palette. Obsidian may position the submenu on the left in narrow windows.",
    "Солнечное сияние": "Sunlit glow",
    "Фиолетовая магия": "Violet magic",
    "Схлопывание света": "Collapsing light",
    "Тёмное ядро и огненный диск": "A dark core and a fiery disk",
    "Радужный перелив": "Flowing rainbow",
    "Розовые лепестки": "Pink petals",
    "Ночная дымка и звёзды": "Night mist and stars",
    "Закат и искры": "Sunset and sparks",
    "Перламутровые грани": "Pearlescent facets",
    "Радужный след и молния": "Rainbow trails and lightning",
    "Розовый праздник": "A pink celebration",
    "Медовый свет": "Honey light",
    "Непослушная геометрия": "Unruly geometry",
    "Сине-серебряная энергия": "Blue and silver energy",
    "Розово-голубые кристаллы": "Pink and blue crystals",
    "Обсидиан и изумруд": "Obsidian and emerald",
    "Tw · Боевая форма": "Tw · Battle form",
    "Корона и длинные пряди": "A crown and flowing strands",
    "Лунный поток внутри букв": "Moonlight flowing through letters",
    "Пламя внутри букв": "Flame inside letters",
    "Магические дуги внутри букв": "Magical arcs inside letters",
    "Белое золото": "White Gold",
    "Белые буквы, золотые края и тонкие нити":
      "White letters with golden edges and fine threads",
    Нежность: "Tenderness",
    "Ещё мягче: кремово-розовый свет и лепестки":
      "Soft cream and pink light with petals",
    Скорость: "Speed",
    "Радужный след и короткая мелкая дрожь":
      "Rainbow trails with a subtle rapid tremble",
    "Северное сияние": "Borealis",
    "Зелёно-лиловые световые ленты": "Green and lilac ribbons of light",
    "Жидкое серебро": "Liquid Silver",
    "Металлический перелив внутри букв":
      "Metallic light flowing through letters",
    "Розовый кварц": "Rose Quartz",
    "Мягкий розовый кристалл с гранями": "Soft pink crystal facets",
    Глубина: "Deep Ocean",
    "Холодное течение и светящийся планктон":
      "Cool currents and glowing plankton",
    "Звёздный шёлк": "Star Silk",
    "Плавные небесные нити внутри букв":
      "Flowing celestial threads inside letters",
    "Тлеющие чернила": "Ember Ink",
    "Медные чернила и золотые прожилки": "Copper ink and golden veins",
    Голограмма: "Hologram",
    "Бирюзовая проекция с мягким сканированием":
      "A turquoise projection and a gentle scan",
    "Лесной свет": "Mosslight",
    "Мох, тёплая зелень и маленькие светлячки":
      "Moss, warm green light and tiny fireflies",
    "Tw · Суверен": "Tw · Sovereign",
    "ПИК · броня, корона и серебряные потоки":
      "PEAK · Armor, a crown and silver streams",
    "Celestia · Зенит": "Celestia · Zenith",
    "ПИК · солнечная печать и золотое оперение":
      "PEAK · A solar seal and golden plumage",
    "Luna · Астрал": "Luna · Astral",
    "ПИК · карта созвездий и лунная орбита":
      "PEAK · A constellation map and a lunar orbit",
    "Fluttershy · Эдем": "Fluttershy · Eden",
    "ПИК · ботаническая лента и маленькая бабочка":
      "PEAK · A botanical ribbon and a tiny butterfly",
    "TON 618 · Горизонт событий": "TON 618 · Event Horizon",
    "ПИК · тёмная апертура и янтарные орбиты":
      "PEAK · A dark aperture and amber orbits",
    "Nightmare Moon · Затмение": "Nightmare Moon · Eclipse",
    "ПИК · серебристый свет и звёзды внутри букв":
      "PEAK · Silver light and stars inside letters",
    "Daybreaker · Сверхновая": "Daybreaker · Nova",
    "ПИК · огненные кольца и прожилки внутри букв":
      "PEAK · Fiery rings and veins inside letters",
    "Midnight Sparkle · Разлом": "Midnight Sparkle · Rift",
    "ПИК · кристаллические трещины и магические дуги внутри букв":
      "PEAK · Crystal cracks and magical arcs inside letters",
    Пульсация: "Pulse",
    "Одна волна слева направо по контурам букв, свой цвет":
      "A single left-to-right outline wave in your chosen color",
    "Больной?": "Sick?",
    "Каждая буква со своим искажением и характером":
      "Each letter has its own distortion and character",
    "Флаттершай · Крылья нежности": "Fluttershy · Wings of Tenderness",
    "ПИК · розовый перелив внутри букв и жёлтые перьевые крылья":
      "PEAK · Flowing pink letters and yellow feathered wings",
    "Выделение находится в блоке кода.":
      "The selection is inside a fenced code block.",
    "В свойствах заметки стили текста не применяются.":
      "Text styles cannot be applied inside note properties.",
    "Выделение находится внутри кода.": "The selection is inside inline code.",
    "Выдели сами слова без Markdown-разметки, ссылок и кода.":
      "Select plain words without Markdown, links or code.",
    "Некорректный диапазон выделения.": "Invalid selection range.",
    "Сначала выдели слова в заметке. В готовом стиле достаточно поставить курсор внутрь текста.":
      "Select some words first. To change an existing style, place the cursor inside it.",
    "Выделение пересекает готовый стиль. Выдели его целиком или поставь курсор внутри.":
      "The selection overlaps an existing style. Select the entire span or place the cursor inside it.",
    "Выдели непустой текст.": "Select some non-empty text.",
    "Выдели текст без HTML-тегов.": "Select text without HTML tags.",
    "Текст находится внутри другого span. Сначала выйди из него.":
      "This text is inside another span. Move outside that span first.",
    "Заметка изменилась, пока открыта палитра. Выдели текст заново.":
      "The note changed while the picker was open. Select the text again.",
    "Язык интерфейса": "Interface language",
    "Изменение языка действует для новых меню. Команды обновятся после перезапуска плагина.":
      "New menus use the selected language immediately. Reload the plugin to update command names.",
    Автоматически: "Automatic",
  };
  let language = "en";
  function setLanguage(value) {
    const detected =
      typeof navigator !== "undefined" ? navigator.language : "en";
    language =
      value === "ru" || (value === "auto" && /^ru\b/i.test(detected))
        ? "ru"
        : "en";
  }
  function t(value) {
    return language === "ru" ? value : (english[value] ?? value);
  }
  return {
    t,
    setLanguage,
    get language() {
      return language;
    },
  };
})();
const atxTranslate = (value) => AuroraI18n.t(value);
