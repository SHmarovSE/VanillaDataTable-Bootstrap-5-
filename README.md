<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40">


<body lang=RU style='tab-interval:35.4pt;word-wrap:break-word'>

<div class=WordSection1>

<div class=MsoNormal align=center style='text-align:center'>

<hr size=1 width="100%" align=center>

</div>

<p class=MsoNormal><b>Класс <span class=SpellE>VanillaDataTable</span>
(<span class=SpellE>Bootstrap</span> 5)<o:p></o:p></b></p>

<p class=MsoNormal>Универсальный легковесный компонент на чистом JavaScript
(без <span class=SpellE>jQuery</span>) для создания интерактивных динамических
таблиц на базе <span class=SpellE><b>Bootstrap</b></span><b> 5</b>.
Поддерживает серверную пагинацию, умную систему фокуса строк, динамические
панели инструментов с разграничением прав на основе выделения элементов и
атомарную перенумерацию порядка отображения записей.<o:p></o:p></p>

<div class=MsoNormal align=center style='text-align:center'>

<hr size=1 width="100%" align=center>

</div>
## Новые возможности (v1.1.0)

### 1. Метод `destroy()`
Уничтожает экземпляр таблицы, удаляет созданную DOM-разметку, сбрасывает настройки и останавливает активные процессы для предотвращения утечек памяти.

```javascript
// Инициализация таблицы
const myTable = new VanillaDataTable('#myTableElement', { /* настройки */ });

// Когда таблица больше не нужна (например, при переключении вкладок в SPA)
myTable.destroy();
```

### 2. Кастомные стили для кнопок (`style`)
В массиве конфигурации кнопок `buttons` теперь можно передавать атрибут `style` для точечной настройки внешнего вида одиночных кнопок или выпадающих списков.

```javascript
const myTable = new VanillaDataTable('#myTableElement', {
    buttons: [
        {
            title: 'Удалить выбранные',
            icon: 'bi bi-trash',
            // Передача инлайн-стилей напрямую в элемент кнопки
            style: 'background-color: #dc3545; border-color: #dc3545; color: white;',
            action: function() {
                // ваш код удаления
            }
        }
    ]
});
```

### `async reload(resetPage = true, keepSelection = false)`
Принудительно перезагружает данные с сервера и полностью перерисовывает таблицу. Так как метод асинхронный, он возвращает `Promise`, что позволяет выполнять код строго после завершения обновления данных.

**Параметры:**
* `resetPage` (boolean): Если `true` (по умолчанию), сбросит пагинацию и вернет пользователя на 1-ю страницу.
* `keepSelection` (boolean): Новинка! Если `true`, метод попытается сохранить фокус и выделение на текущей активной строке (работает, только если `resetPage` установлен в `false`).

```javascript
// Пример 1: Обычная перезагрузка со сбросом на первую страницу
await myTable.reload();

// Пример 2: Обновление данных на текущей странице с сохранением выделенной строки
await myTable.reload(false, true); 
console.log('Данные обновлены, фокус на строке сохранен!');
```


## 📂 Блок 1: Конфигурация (`options`)

Конфигурационный объект передается вторым параметром в конструктор класса: `new VanillaDataTable(containerSelector, options)`.

### ⚙️ Базовые параметры и управление интерфейсом

* **`tableId`** *(String | null)*: Уникальный ID для генерируемого HTML-тега `<table>`. По умолчанию: `null`.
* **`apiUrl`** *(String)*: URL-адрес эндпоинта бэкенда для получения JSON-данных таблицы.
* **`perPageOptions`** *(Array)*: Массив доступных опций лимита строк в селекте. Пример: `[10, 25, 50, "all"]`.
* **`defaultLimit`** *(Number)*: Количество записей на страницу по умолчанию. По умолчанию: `10`.
* **`searchPlaceholder`** *(String)*: Текст-подсказка в поле глобального поиска. По умолчанию: `'Поиск...'`.
* **`showSearch`** *(Boolean)*: Показывать или скрывать строку глобального поиска. По умолчанию: `true`.
* **`showFilter`** *(Boolean)*: Включать или выключать генерацию панели in-memory фильтров колонок. По умолчанию: `false`.
* **`showOrderButtons`** *(Boolean)*: Показывать кнопки перемещения строк «Вверх / Вниз». По умолчанию: `false`.
* **`excelExport`** *(Boolean)*: Флаг отображения кнопки экспорта данных в формат Excel XML. По умолчанию: `true`.
* **`excelPrefix`** *(String)*: Префикс имени скачиваемого файла экспорта. По умолчанию: `'export'`.
* **`checkboxSelect`** *(Boolean)*: Включает техническую колонку мультивыбора чекбоксами. По умолчанию: `false`.
* **`keyField`** *(String)*: Имя уникального поля объекта (первичного ключа), используемого как индекс для мультивыбора. По умолчанию: `'id'`.

---

### 🔲 Конфигурация колонок (`columns`)

Массив объектов, каждый из которых описывает поведение столбца:

* **`field`** *(String)*: Имя ключа в объекте данных.
* **`title`** *(String)*: Отображаемый заголовок колонки.
* **`visible`** *(Boolean)*: Управление видимостью колонки на экране. По умолчанию: `true`.
* **`sortable`** *(Boolean)*: Разрешить серверную сортировку по данной колонке.
* **`filter`** *(String)*: Тип локального фильтра (`'none'`, `'select'`, `'search'`).
* **`render`** *(Function | undefined)*: Кастомный форматировщик содержимого ячейки. Принимает параметры `(cellValue, rowData)`. Должен возвращать строку или HTML-строку.


## 🎛️ Блок 2: Динамические кнопки (`buttons`)

Параметр `buttons` — это декларативный массив, описывающий кастомные элементы управления на верхней панели над шапкой таблицы. Компонент поддерживает два типа элементов: одиночные кнопки и многоуровневые выпадающие списки (дропдауны).

---

### 💎 Настройки одиночной кнопки (`type: 'button'`)

```javascript
{
  type: 'button',
  label: '<i class="bi bi-plus-lg"></i> Добавить', // Текст или HTML-иконка
  title: 'Создать новую запись',                   // Всплывающая подсказка
  className: 'btn-outline-success',               // Кастомный класс Bootstrap 5
  style: 'background-color: #28a745; color: #fff;', // Кастомные инлайн-стили элемента
  requiresSelection: false,                       // true — кнопка заблокирована, пока не выбрана строка tr
  action: (selectedRowData, rowElement) => {      // Функция-колбэк при клике
    console.log("Данные выбранной строки:", selectedRowData);
  }
}
```

---

### 📂 Настройки выпадающего списка (`type: 'dropdown'`)

Используется для компактной группировки смежных или контекстных действий над строкой.

```javascript
{
  type: 'dropdown',
  label: '<i class="bi bi-gear"></i> Действия', // Текст кнопки-триггера дропдауна
  title: 'Операции над данными',                // Всплывающая подсказка
  className: 'btn-outline-secondary',           // Кастомный класс Bootstrap 5
  style: 'margin-right: 5px;',                  // Кастомные инлайн-стили элемента
  items: [                                      // Массив вложенных пунктов меню
    {
      label: '<i class="bi bi-pencil"></i> Редактировать',
      requiresSelection: true,                  // Пункт станет активным только при выделении tr
      action: (selectedRowData, rowElement) => { /* Логика */ }
    },
    { 
      type: 'divider'                           // Специальный тип для рендера разделительной линии
    },
    {
      label: '<i class="bi bi-trash"></i> Удалить',
      className: 'text-danger',                 // Стилизация текста пункта меню
      requiresSelection: true,
      action: (selectedRowData) => { /* Логика */ }
    }
  ]
}
```

💡 **Важная деталь архитектуры `disabled`:** Если абсолютно все значимые вложенные пункты дропдауна (`items`) помечены как `requiresSelection: true`, класс таблицы автоматически заблокирует саму главную кнопку-триггер выпадающего списка в DOM до тех пор, пока строка не будет выбрана пользователем. Если хотя бы один пункт является глобальным (`requiresSelection: false`), дропдаун будет открываться всегда, точечно отключая внутренние пункты.


## 🔃 Блок 3: Перенумерация и рокировка строк (`onRenumberRow`)

Для активации встроенного механизма физического изменения порядка следования записей используются следующие параметры конфигурации:

* **`showOrderButtons`** *(Boolean)*: Включает отображение жестко зафиксированной группы `.btn-group` с кнопками «Вверх» и «Вниз» на левом краю панели управления.
* **`idField`** *(String)*: Имя поля-идентификатора строки, которое будет передано на бэкенд. По умолчанию берет значение из `keyField`.
* **`orderField`** *(String)*: Имя физического числового поля порядка отображения данных в БД (например, `sort_order`). По умолчанию: `'display_order'`.
* **`extraFields`** *(Array)*: Массив имен сопутствующих полей строки, значения которых критически важно отправить на бэкенд вместе с запросом рокировки (например, идентификаторы групп, родительских категорий или проектов). По умолчанию: `[]`.

---

### ⚡ Хук `onRenumberRow(resultPayload)`

Асинхронная функция-обработчик, которая вызывается при клике на стрелки изменения порядка. Она обязана отправить запрос на сервер и вернуть `true` в случае успешного выполнения операции в БД, чтобы таблица инициировала умное обновление данных.

#### Формат передаваемого плоского объекта (`resultPayload`):

Класс генерирует строго плоскую, очищенную структуру данных, готовую к разбору на стороне API без лишних вычислений:

```json
{
  "id": "1106",
  "old_number": "22",
  "new_number": "21",
  "project_id": "12"
}
```

---

### 🔴 КРИТИЧЕСКИ ВАЖНО: Алгоритм бэкенд-транзакции

На поле, указанном в `orderField`, в базе данных практически всегда накладывается индекс уникальности (Unique Constraint). Чтобы избежать ошибок дублирования ключей при одновременном обновлении записей, ваш серверный скрипт в рамках **единой базы транзакции** должен выполнять рокировку по следующей схеме:

1. **Поиск соседа:** Сервер принимает параметры (`id`, `old_number`, `new_number`, `extra_fields`) и находит сопутствующую запись, у которой поле порядка на текущий момент равно `new_number` (с учетом ограничений из `extra_fields`). Фиксирует её `ID_соседа`.
2. **Временный буфер:** Для `ID_соседа` устанавливается заведомо недостижимый временный порядковый номер (например, `100 000 000`). Это освобождает ячейку `new_number`.
3. **Обновление активной строки:** Для целевой записи по пришедшему `id` устанавливается значение `new_number`.
4. **Закрытие рокировки:** Для `ID_соседа` устанавливается значение `old_number`.
5. **Фиксация (Commit):** Транзакция закрывается, гарантируя атомарность и целостность индексов.


## 🔧 Блок 4: Публичные методы класса

Эти методы доступны для вызова на экземпляре созданного класса (например, `const table = new VanillaDataTable(...); table.reload();`).

### 🔄 `async reload(resetPage = true, keepSelection = false)`

Принудительно запрашивает свежие данные с сервера и полностью перерисовывает содержимое таблицы.

* **`resetPage`** *(Boolean)*: При значении `true` сбрасывает пагинацию на 1-ю страницу (используется при новом поиске). При `false` — оставляет пользователя на текущей странице (используется при рокировке или точечном изменении данных).
* **`keepSelection`** *(Boolean)*: Умный режим удержания фокуса. Если `true` (и `resetPage === false`), метод перед очисткой DOM запоминает ID текущей выделенной строки, дожидается ответа сервера, перерисовывает таблицу и автоматически восстанавливает фокус на ней с обновлением всех данных в памяти.

### 🎯 `selectRow(fieldName, value)`

Публичный метод-локатор, предназначенный для программного выделения строки как изнутри внутренних механизмов, так и из внешних скриптов управления приложениеем (например, при интеграции со сторонними картами, деревьями категорий или формами).

* **`fieldName`** *(String)*: Имя ключа объекта, по которому ведется поиск (`'id'`, `'uuid'`).
* **`value`** *(Any)*: Искомое значение.
* **Возвращает:** *Boolean* (`true` — если строка найдена и успешно подсвечена в UI, `false` — если запись на текущей странице отсутствует, при этом внутреннее состояние `_selectedRowData` безопасно очищается).

### 🔍 `async searchAndSelect(id, keyField = 'id')`

Специализированный метод сквозного поиска. Устанавливает значение глобального поиска в переданный `id`, сбрасывает пагинацию на 1-ю страницу, загружает данные и выполняет автовыделение найденной строки в UI.

### 🧼 `clearSelection()`

Программно сбрасывает текущее активное выделение строки, удаляет CSS-класс `.table-active` у элементов `<tr>` (если на них не установлен чекбокс мультивыбора), очищает переменную состояния и отправляет управляющим кастомным кнопкам сигнал на блокировку.

### 💥 `destroy()`

Полностью уничтожает экземпляр класса, удаляет сгенерированную HTML-разметку таблицы из DOM-дерева, сбрасывает внутренние настройки и останавливает активные процессы для предотвращения утечек памяти в браузере.

---

## 🔌 Блок 5: Хуки обратного вызова (Callbacks)

* **`fetchDataProvider`** *(Function | null)*: Альтернативный поставщик данных. Если передан, класс полностью отказывается от встроенного механизма `fetch(apiUrl)` и вызывает эту функцию, передавая в неё объект текущего состояния таблицы (`page`, `limit`, `search`, `sortBy`, `sortDir`). Должна возвращать объект формата `{ items: [...], total: Number }`.
* **`onRowSelect`** *(Function | null)*: Вызывается каждый раз, когда пользователь или система делает строку активной. Передает параметры `(selectedRowData, rowElement)`.
* **`onClearSelection`** *(Function | null)*: Вызывается в момент полного программного или ручного сброса выделения строки.
* **`checkRow`** *(Function | null)*: Функция-предикат серверной автосинхронизации чекбоксов мультивыбора. Вызывается для каждого элемента массива при каждой новой загрузке данных. Если возвращает `true`, строка автоматически помечается галочкой и добавляется в карту выбранных элементов.


<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128221;</span> Полный пример
комплексной инициализации<o:p></o:p></b></p>

<p class=MsoNormal><i>// Инициализация таблицы с комплексной панелью кнопок и
перенумерацией</i><o:p></o:p></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>const <span
class=SpellE>projectTable</span> = new <span class=SpellE><span class=GramE>VanillaDataTable</span></span><span
class=GramE>(</span>'#<span class=SpellE>myTableContainer</span>', {<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><span class=SpellE>tableId</span>: '<span
class=SpellE>crm</span>-leads-table',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><span class=SpellE>apiUrl</span>: '/<span
class=SpellE>api</span>/v1/leads/list',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><span class=SpellE>keyField</span>: 'id',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><span class=SpellE>checkboxSelect</span>: false,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><span class=SpellE>showSearch</span>: true,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span></span><span class=SpellE>showFilter</span>:
<span class=SpellE>true</span>, <i>// Включаем панель локальной фильтрации</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><i>// Сортировка
порядка строк</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><span
class=SpellE>showOrderButtons</span>: <span class=SpellE>true</span>,<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><span
class=SpellE><span lang=EN-US style='mso-ansi-language:EN-US'>idField</span></span><span
lang=EN-US style='mso-ansi-language:EN-US'>: 'id',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><span class=SpellE>orderField</span>: '<span
class=SpellE>sort_index</span>',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span></span><span class=SpellE>extraFields</span>:
['<span class=SpellE>project_id</span>'], <i>// Передаем контекст проекта на
бэк</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><i>// Описываем
конфигурацию колонок</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><span
class=SpellE>columns</span>: [<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>        </span><span
class=GramE>{ <span class=SpellE>field</span></span>: '<span class=SpellE>id</span>',
<span class=SpellE>title</span>: 'ID', <span class=SpellE>visible</span>: <span
class=SpellE><span class=GramE>false</span></span><span class=GramE> }</span>,<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>        </span><span
class=GramE><span lang=EN-US style='mso-ansi-language:EN-US'>{ field</span></span><span
lang=EN-US style='mso-ansi-language:EN-US'>: '<span class=SpellE>sort_index</span>',
title: '</span>Порядок<span lang=EN-US style='mso-ansi-language:EN-US'>', sortable:
true, filter: 'none<span class=GramE>' }</span>,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span><span class=GramE>{ field</span>: '<span
class=SpellE>created_at</span>', title: '</span>Дата<span style='mso-ansi-language:
EN-US'> </span>создания<span lang=EN-US style='mso-ansi-language:EN-US'>', sortable:
true, filter: 'search<span class=GramE>' }</span>,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span>{ <o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>field: 'status', <o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>title: '</span>Статус<span
lang=EN-US style='mso-ansi-language:EN-US'>', <o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>sortable: true, <o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span></span><span class=SpellE>filter</span>:
'<span class=SpellE>select</span>', <i>// Генерирует уникальный выпадающий
список в шапке</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>            </span><span
lang=EN-US style='mso-ansi-language:EN-US'>render: (<span class=SpellE>val</span>)
=&gt; `&lt;span class=&quot;badge <span class=SpellE>bg</span>-primary&quot;&gt;${<span
class=SpellE>val</span>}&lt;/span&gt;` <o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span>},<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span><span class=GramE>{ field</span>: 'title',
title: '</span>Наименование<span lang=EN-US style='mso-ansi-language:EN-US'>', filter:
'search<span class=GramE>' }</span><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span></span>],<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><i>//
Декларативная панель кастомных кнопок действий</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><span
class=SpellE>buttons</span>: [<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>        </span><span
lang=EN-US style='mso-ansi-language:EN-US'>{<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>type: 'button',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>label: '&lt;<span class=SpellE>i</span>
class=&quot;bi bi-plus-lg&quot;&gt;&lt;/<span class=SpellE>i</span>&gt; </span>Создать<span
lang=EN-US style='mso-ansi-language:EN-US'>',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span><span class=SpellE>className</span>:
'<span class=SpellE>btn</span>-outline-success',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span><span class=SpellE>requiresSelection</span>:
false, <i>// </i></span><i>Доступна</i><i><span style='mso-ansi-language:EN-US'>
</span>всегда</i><span lang=EN-US style='mso-ansi-language:EN-US'><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span></span><span class=SpellE>action</span>:
() =&gt; <span class=SpellE><span class=GramE>alert</span></span><span
class=GramE>(</span>'Открываем модальное окно создания!')<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>        </span><span
lang=EN-US style='mso-ansi-language:EN-US'>},<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span>{<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>type: 'dropdown',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>label: '&lt;<span class=SpellE>i</span>
class=&quot;bi bi-shield-lock&quot;&gt;&lt;/<span class=SpellE>i</span>&gt; </span>Администрирование<span
lang=EN-US style='mso-ansi-language:EN-US'>',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span><span class=SpellE>className</span>:
'<span class=SpellE>btn</span>-outline-secondary',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>items: [<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>              </span><span
style='mso-spacerun:yes'>  </span>{<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                    </span>label: '&lt;<span
class=SpellE>i</span> class=&quot;bi bi-pencil&quot;&gt;&lt;/<span
class=SpellE>i</span>&gt; </span>Редактировать<span style='mso-ansi-language:
EN-US'> </span>карточку<span lang=EN-US style='mso-ansi-language:EN-US'>',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                    </span></span><span class=SpellE>requiresSelection</span>:
<span class=SpellE>true</span>, <i>// Активно только при выборе <span
class=SpellE>tr</span></i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>                    </span><span
lang=EN-US style='mso-ansi-language:EN-US'>action: (data) =&gt; <span
class=GramE>console.log(</span>'</span>Редактируем<span style='mso-ansi-language:
EN-US'> </span>объект<span lang=EN-US style='mso-ansi-language:EN-US'>:', data)<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                </span>},<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                </span><span class=GramE>{ type</span>:
'divider<span class=GramE>' }</span>,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                </span>{<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                    </span>label: '&lt;<span
class=SpellE>i</span> class=&quot;bi bi-trash&quot;&gt;&lt;/<span class=SpellE>i</span>&gt;
</span>Удалить<span style='mso-ansi-language:EN-US'> </span>запись<span
lang=EN-US style='mso-ansi-language:EN-US'>',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                    </span><span class=SpellE>className</span>:
'text-danger',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                    </span><span class=SpellE>requiresSelection</span>:
true,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                    </span>action: (data) =&gt; {<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                        </span>if(confirm('</span>Удалить<span
lang=EN-US style='mso-ansi-language:EN-US'>?')) <span class=GramE>console.log(</span>'</span>Удаляем<span
lang=EN-US style='mso-ansi-language:EN-US'> ID:', data.id);<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                    </span>}<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                </span>}<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>]<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span>}<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span>],<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><i>// </i></span><i>Реализация</i><i><span
style='mso-ansi-language:EN-US'> </span>хука</i><i><span style='mso-ansi-language:
EN-US'> </span>рокировки</i><i><span style='mso-ansi-language:EN-US'> </span>полей</i><i><span
style='mso-ansi-language:EN-US'> </span>порядка</i><span lang=EN-US
style='mso-ansi-language:EN-US'><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><span class=SpellE>onRenumberRow</span>: async
(payload) =&gt; {<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span></span><span class=SpellE>try</span> {<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>            </span><span
lang=EN-US style='mso-ansi-language:EN-US'>const response = await <span
class=GramE>fetch(</span>'/<span class=SpellE>api</span>/v1/leads/swap-order',
{<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                </span>method: 'POST',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                </span>headers: <span class=GramE>{ '</span>Content-Type':
'application/<span class=SpellE>json</span><span class=GramE>' }</span>,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>                </span>body: <span class=SpellE>JSON.stringify</span>(payload)
<i>// </i></span><i>улетит</i><i><span style='mso-ansi-language:EN-US'> </span>плоский</i><i><span
lang=EN-US style='mso-ansi-language:EN-US'> JSON {id, <span class=SpellE>old_number</span>,
<span class=SpellE>new_number</span>, <span class=SpellE>project_id</span>}</span></i><span
lang=EN-US style='mso-ansi-language:EN-US'><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>});<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>const res = await <span
class=SpellE><span class=GramE>response.json</span></span>();<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span></span><span class=SpellE>return</span>
<span class=SpellE><span class=GramE>res.success</span></span> === <span
class=SpellE>true</span>; <i>// Возвращаем булево значение успеха транзакции</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>        </span><span
lang=EN-US style='mso-ansi-language:EN-US'>} catch (err) {<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span><span class=SpellE><span
class=GramE>console.error</span></span>(err);<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>return false;<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span>}<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span>},<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><span class=SpellE>onRowSelect</span>: (data,
element) =&gt; {<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span></span><span class=GramE>console.log(</span>'Текущая
активная строка в системе:', data.id);<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span>}<o:p></o:p></p>

<p class=MsoNormal>});<o:p></o:p></p>

<div class=MsoNormal align=center style='text-align:center'>

<hr size=1 width="100%" align=center>

</div>

<p class=MsoNormal><br style='mso-special-character:line-break'>
<![if !supportLineBreakNewLine]><br style='mso-special-character:line-break'>
<![endif]><o:p></o:p></p>

<p class=MsoNormal><o:p>&nbsp;</o:p></p>

</div>

</body>

</html>
