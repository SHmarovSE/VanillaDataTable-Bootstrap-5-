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

<p class=MsoNormal><b>Техническая документация: Класс <span class=SpellE>VanillaDataTable</span>
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

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128194;</span> Блок 1: Конфигурация (<span
class=SpellE>options</span>)<o:p></o:p></b></p>

<p class=MsoNormal>Конфигурационный объект передается вторым параметром в
конструктор класса: <span class=SpellE>new</span> <span class=SpellE><span
class=GramE>VanillaDataTable</span></span><span class=GramE>(</span><span
class=SpellE>containerSelector</span>, <span class=SpellE>options</span>).<o:p></o:p></p>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#9881;&#65039;</span> Базовые параметры
и управление интерфейсом<o:p></o:p></b></p>

<ul style='margin-top:0cm' type=disc>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>tableId</b></span> <i>(<span class=SpellE>String</span> | <span
     class=SpellE>null</span>)</i>: Уникальный ID для генерируемого HTML-тега &lt;<span
     class=SpellE>table</span>&gt;. По умолчанию: <span class=SpellE>null</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>apiUrl</b></span> <i>(<span class=SpellE>String</span>)</i>:
     URL-адрес <span class=SpellE>эндпоинта</span> бэкенда для получения
     JSON-данных таблицы.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>perPageOptions</b></span> <i>(<span class=SpellE>Array</span>)</i>:
     Массив доступных опций лимита строк в <span class=SpellE>селекте</span>.
     Пример: [10, 25, 50, &quot;<span class=SpellE>all</span>&quot;].<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>defaultLimit</b></span> <i>(Number)</i>: Количество
     записей на страницу по умолчанию. По умолчанию: 10.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>searchPlaceholder</b></span> <i>(<span class=SpellE>String</span>)</i>:
     Текст-подсказка в поле глобального поиска. По умолчанию: 'Поиск...'.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>showSearch</b></span> <i>(<span class=SpellE>Boolean</span>)</i><span
     class=GramE>: Показывать</span> или скрывать строку глобального поиска. По
     умолчанию: <span class=SpellE>true</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>showFilter</b></span> <i>(<span class=SpellE>Boolean</span>)</i><span
     class=GramE>: Включать</span> или выключать генерацию панели <span
     class=SpellE>in-memory</span> фильтров колонок. По умолчанию: <span
     class=SpellE>false</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>excelExport</b></span> <i>(<span class=SpellE>Boolean</span>)</i>:
     Флаг отображения кнопки экспорта данных в формат Excel XML. По умолчанию: <span
     class=SpellE>true</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>excelPrefix</b></span> <i>(<span class=SpellE>String</span>)</i>:
     Префикс имени скачиваемого файла экспорта. По умолчанию: '<span
     class=SpellE>export</span>'.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>checkboxSelect</b></span> <i>(<span class=SpellE>Boolean</span>)</i><span
     class=GramE>: Включает</span> техническую колонку <span class=SpellE>мультивыбора</span>
     чекбоксами. По умолчанию: <span class=SpellE>false</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l6 level1 lfo1;tab-stops:list 36.0pt'><span
     class=SpellE><b>keyField</b></span> <i>(<span class=SpellE>String</span>)</i>:
     Имя уникального поля объекта (первичного ключа), используемого как индекс
     для <span class=SpellE>мультивыбора</span>. По умолчанию: '<span
     class=SpellE>id</span>'.<o:p></o:p></li>
</ul>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128736;&#65039;</span> Конфигурация
колонок (<span class=SpellE>columns</span>)<o:p></o:p></b></p>

<p class=MsoNormal>Массив объектов, каждый из которых описывает поведение
столбца:<o:p></o:p></p>

<ul style='margin-top:0cm' type=disc>
 <li class=MsoNormal style='mso-list:l3 level1 lfo2;tab-stops:list 36.0pt'><span
     class=SpellE><b>field</b></span> <i>(<span class=SpellE>String</span>)</i>:
     Имя ключа в объекте данных.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l3 level1 lfo2;tab-stops:list 36.0pt'><span
     class=SpellE><b>title</b></span> <i>(<span class=SpellE>String</span>)</i>:
     Отображаемый заголовок колонки.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l3 level1 lfo2;tab-stops:list 36.0pt'><span
     class=SpellE><b>visible</b></span> <i>(<span class=SpellE>Boolean</span>)</i>:
     Управление видимостью колонки на экране. По умолчанию: <span class=SpellE>true</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l3 level1 lfo2;tab-stops:list 36.0pt'><span
     class=SpellE><b>sortable</b></span> <i>(<span class=SpellE>Boolean</span>)</i><span
     class=GramE>: Разрешить</span> серверную сортировку по данной колонке.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l3 level1 lfo2;tab-stops:list 36.0pt'><b><span
     lang=EN-US style='mso-ansi-language:EN-US'>filter</span></b><span
     lang=EN-US style='mso-ansi-language:EN-US'> <i>(String)</i>: </span>Тип<span
     style='mso-ansi-language:EN-US'> </span>локального<span style='mso-ansi-language:
     EN-US'> </span>фильтра<span lang=EN-US style='mso-ansi-language:EN-US'> ('none',
     'select', 'search').<o:p></o:p></span></li>
 <li class=MsoNormal style='mso-list:l3 level1 lfo2;tab-stops:list 36.0pt'><b><span
     lang=EN-US style='mso-ansi-language:EN-US'>render</span></b><span
     lang=EN-US style='mso-ansi-language:EN-US'> <i>(Function | undefined)</i>:
     </span>Кастомный<span style='mso-ansi-language:EN-US'> </span><span
     class=SpellE>форматировщик</span><span style='mso-ansi-language:EN-US'> </span>содержимого<span
     style='mso-ansi-language:EN-US'> </span>ячейки<span lang=EN-US
     style='mso-ansi-language:EN-US'>. </span>Принимает параметры (<span
     class=SpellE>cellValue</span>, <span class=SpellE>rowData</span>). Должен
     возвращать строку или HTML-строку.<o:p></o:p></li>
</ul>

<div class=MsoNormal align=center style='text-align:center'>

<hr size=1 width="100%" align=center>

</div>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#127899;&#65039;</span> Блок 2:
Динамические кнопки (<span class=SpellE>buttons</span>)<o:p></o:p></b></p>

<p class=MsoNormal>Параметр <span class=SpellE><b>buttons</b></span> — это
декларативный массив, описывающий кастомные элементы управления на верхней
панели над шапкой таблицы. Компонент поддерживает два типа элементов: одиночные
кнопки и многоуровневые выпадающие списки (<span class=SpellE>дропдауны</span>).<o:p></o:p></p>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128142;</span> Настройки одиночной
кнопки (<span class=SpellE>type</span>: '<span class=SpellE>button</span>')<o:p></o:p></b></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>{<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span>type: 'button',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span>label: '&lt;<span class=SpellE>i</span>
class=&quot;bi bi-plus-lg&quot;&gt;&lt;/<span class=SpellE>i</span>&gt; </span>Добавить<span
lang=EN-US style='mso-ansi-language:EN-US'>', <i>// </i></span><i>Текст</i><i><span
style='mso-ansi-language:EN-US'> </span>или</i><i><span lang=EN-US
style='mso-ansi-language:EN-US'> HTML-</span>иконка</i><span lang=EN-US
style='mso-ansi-language:EN-US'><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span></span><span class=SpellE>title</span>: 'Создать
новую запись<span class=GramE>',<span style='mso-spacerun:yes'>   </span></span><span
style='mso-spacerun:yes'>              </span><i>// Всплывающая подсказка</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><span
class=SpellE><span lang=EN-US style='mso-ansi-language:EN-US'>className</span></span><span
lang=EN-US style='mso-ansi-language:EN-US'>: '<span class=SpellE>btn</span>-outline-success<span
class=GramE>',<span style='mso-spacerun:yes'>   </span></span><span
style='mso-spacerun:yes'>           </span><i>// </i></span><i>Кастомный</i><i><span
style='mso-ansi-language:EN-US'> </span>класс</i><i><span lang=EN-US
style='mso-ansi-language:EN-US'> Bootstrap 5</span></i><span lang=EN-US
style='mso-ansi-language:EN-US'><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span></span><span class=SpellE>requiresSelection</span>:
<span class=SpellE><span class=GramE>false</span></span><span class=GramE>,<span
style='mso-spacerun:yes'>   </span></span><span
style='mso-spacerun:yes'>                   </span><i>// <span class=SpellE>true</span>
— кнопка заблокирована, пока не выбрана строка <span class=SpellE>tr</span></i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><span lang=EN-US
style='mso-ansi-language:EN-US'>action: (<span class=SpellE>selectedRowData</span>,
<span class=SpellE>rowElement</span>) =&gt; <span class=GramE>{<span
style='mso-spacerun:yes'>  </span></span><span
style='mso-spacerun:yes'>   </span><i>// </i></span><i>Функция</i><i><span
lang=EN-US style='mso-ansi-language:EN-US'>-</span><span class=SpellE>колбэк</span></i><i><span
style='mso-ansi-language:EN-US'> </span>при</i><i><span style='mso-ansi-language:
EN-US'> </span>клике</i><span lang=EN-US style='mso-ansi-language:EN-US'><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span></span><span class=GramE>console.log(</span>&quot;Данные
выбранной строки:&quot;, <span class=SpellE>selectedRowData</span>);<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span>}<o:p></o:p></p>

<p class=MsoNormal>}<o:p></o:p></p>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128450;&#65039;</span> Настройки
выпадающего списка (<span class=SpellE>type</span>: '<span class=SpellE>dropdown</span>')<o:p></o:p></b></p>

<p class=MsoNormal>Используется для компактной группировки смежных или
контекстных действий над строкой.<o:p></o:p></p>

<p class=MsoNormal>{<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><span
class=SpellE>type</span>: '<span class=SpellE>dropdown</span>',<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><span
class=SpellE>label</span>: '&lt;i <span class=SpellE>class</span>=&quot;<span
class=SpellE>bi</span> <span class=SpellE>bi-gear</span><span class=GramE>&quot;&gt;&lt;</span>/i&gt;
Действия<span class=GramE>',<span style='mso-spacerun:yes'>  </span><i>/</i></span><i>/
Текст кнопки-триггера <span class=SpellE>дропдауна</span></i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span><span lang=EN-US
style='mso-ansi-language:EN-US'>title: '</span>Операции<span style='mso-ansi-language:
EN-US'> </span>над<span style='mso-ansi-language:EN-US'> </span>данными<span
lang=EN-US style='mso-ansi-language:EN-US'>',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span><span class=SpellE>className</span>: '<span
class=SpellE>btn</span>-outline-secondary',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>    </span></span><span class=SpellE>items</span>: <span
class=GramE>[ <i>/</i></span><i>/ Массив вложенных пунктов меню</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>        </span>{<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>            </span><span
lang=EN-US style='mso-ansi-language:EN-US'>label: '&lt;<span class=SpellE>i</span>
class=&quot;bi bi-pencil&quot;&gt;&lt;/<span class=SpellE>i</span>&gt; </span>Редактировать<span
lang=EN-US style='mso-ansi-language:EN-US'>',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span></span><span class=SpellE>requiresSelection</span>:
<span class=SpellE><span class=GramE>true</span></span><span class=GramE>,<span
style='mso-spacerun:yes'>   </span></span><span
style='mso-spacerun:yes'>           </span><i>// Пункт станет активным только
при выделении <span class=SpellE>tr</span></i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>            </span><span
class=SpellE>action</span>: (<span class=SpellE>selectedRowData</span>, <span
class=SpellE>rowElement</span>) =&gt; <span class=GramE>{ <i>/</i></span><i>*
Логика *<span class=GramE>/<span style='font-style:normal'> }</span></span></i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>        </span>},<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>        </span><span
class=GramE>{ <span class=SpellE>type</span></span>: '<span class=SpellE>divider</span><span
class=GramE>' }</span>,<span style='mso-spacerun:yes'>                      
</span><i>// Специальный тип для рендера разделительной линии</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>        </span><span
lang=EN-US style='mso-ansi-language:EN-US'>{<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>label: '&lt;<span class=SpellE>i</span>
class=&quot;bi bi-trash&quot;&gt;&lt;/<span class=SpellE>i</span>&gt; </span>Удалить<span
lang=EN-US style='mso-ansi-language:EN-US'>',<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span></span><span class=SpellE>className</span>:
'<span class=SpellE>text-danger</span><span class=GramE>',<span
style='mso-spacerun:yes'>   </span></span><span
style='mso-spacerun:yes'>           </span><i>// Стилизация текста пункта меню</i><o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>            </span><span
class=SpellE><span lang=EN-US style='mso-ansi-language:EN-US'>requiresSelection</span></span><span
lang=EN-US style='mso-ansi-language:EN-US'>: true,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>            </span>action: (<span class=SpellE>selectedRowData</span>)
=&gt; <span class=GramE>{ <i>/</i></span><i>* </i></span><i>Логика</i><i><span
lang=EN-US style='mso-ansi-language:EN-US'> *<span class=GramE>/<span
style='font-style:normal'> }</span></span></span></i><span lang=EN-US
style='mso-ansi-language:EN-US'><o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>        </span></span>}<o:p></o:p></p>

<p class=MsoNormal><span style='mso-spacerun:yes'>    </span>]<o:p></o:p></p>

<p class=MsoNormal>}<o:p></o:p></p>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128161;</span> Важная деталь
архитектуры <span class=SpellE>disabled</span><span class=GramE>:<span
style='font-weight:normal'> Если</span></span></b> абсолютно <b>все</b>
значимые вложенные пункты <span class=SpellE>дропдауна</span> (<span
class=SpellE>items</span>) помечены как <span class=SpellE>requiresSelection</span>:
<span class=SpellE>true</span>, класс таблицы автоматически заблокирует саму
главную кнопку-триггер выпадающего списка в DOM до тех пор, пока строка не
будет выбрана пользователем. Если хотя бы один пункт является глобальным (<span
class=SpellE>requiresSelection</span>: <span class=SpellE>false</span>), <span
class=SpellE>дропдаун</span> будет открываться всегда, точечно отключая
внутренние пункты.<o:p></o:p></p>

<div class=MsoNormal align=center style='text-align:center'>

<hr size=1 width="100%" align=center>

</div>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128256;</span> Блок 3: Перенумерация и
рокировка строк (<span class=SpellE>onRenumberRow</span>)<o:p></o:p></b></p>

<p class=MsoNormal>Для активации встроенного механизма физического изменения
порядка следования записей используются следующие параметры конфигурации:<o:p></o:p></p>

<ul style='margin-top:0cm' type=disc>
 <li class=MsoNormal style='mso-list:l5 level1 lfo3;tab-stops:list 36.0pt'><span
     class=SpellE><b>showOrderButtons</b></span> <i>(<span class=SpellE>Boolean</span>)</i><span
     class=GramE>: Включает</span> отображение жестко зафиксированной <span
     class=GramE>группы .<span class=SpellE>btn</span></span><span
     class=SpellE>-group</span> с кнопками <b>«Вверх»</b> и <b>«Вниз»</b> на
     левом краю панели управления.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l5 level1 lfo3;tab-stops:list 36.0pt'><span
     class=SpellE><b>idField</b></span> <i>(<span class=SpellE>String</span>)</i>:
     Имя поля-идентификатора строки, которое будет передано на бэкенд. По
     умолчанию берет значение из <span class=SpellE>keyField</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l5 level1 lfo3;tab-stops:list 36.0pt'><span
     class=SpellE><b>orderField</b></span> <i>(<span class=SpellE>String</span>)</i>:
     Имя физического числового поля порядка отображения данных в БД (например, <span
     class=SpellE>sort_order</span>). По умолчанию: '<span class=SpellE>display_order</span>'.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l5 level1 lfo3;tab-stops:list 36.0pt'><span
     class=SpellE><b>extraFields</b></span> <i>(<span class=SpellE>Array</span>)</i>:
     Массив имен сопутствующих полей строки, значения которых критически важно
     отправить на бэкенд вместе с запросом рокировки (например, идентификаторы
     групп, родительских категорий или проектов). По умолчанию: [].<o:p></o:p></li>
</ul>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#9889;</span> Хук <span class=SpellE>onRenumberRow</span>(<span
class=SpellE>resultPayload</span>)<o:p></o:p></b></p>

<p class=MsoNormal>Асинхронная функция-обработчик, которая вызывается при клике
на стрелки изменения порядка. Она обязана отправить запрос на сервер и вернуть <span
class=SpellE><b>true</b></span> в случае успешного выполнения операции в БД,
чтобы таблица инициировала умное обновление данных.<o:p></o:p></p>

<p class=MsoNormal><b>Формат передаваемого плоского объекта (<span
class=SpellE>resultPayload</span>):<o:p></o:p></b></p>

<p class=MsoNormal>Класс генерирует строго плоскую, очищенную структуру данных,
готовую к разбору на стороне API без лишних вычислений:<o:p></o:p></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>{<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>  </span>&quot;id&quot;: &quot;1106&quot;,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>  </span>&quot;<span class=SpellE><span class=GramE>old</span>_number</span>&quot;:
&quot;22&quot;,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>  </span>&quot;<span class=SpellE><span class=GramE>new</span>_number</span>&quot;:
&quot;21&quot;,<o:p></o:p></span></p>

<p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'><span
style='mso-spacerun:yes'>  </span></span>&quot;<span class=SpellE>project_id</span>&quot;:
&quot;12&quot; <o:p></o:p></p>

<p class=MsoNormal>}<o:p></o:p></p>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128308;</span> КРИТИЧЕСКИ ВАЖНО:
Алгоритм бэкенд-транзакции<o:p></o:p></b></p>

<p class=MsoNormal>На поле, указанном в <span class=SpellE>orderField</span>, в
базе данных практически всегда накладывается индекс уникальности (<span
class=SpellE>Unique</span> <span class=SpellE>Constraint</span>). Чтобы
избежать ошибок дублирования ключей при одновременном обновлении записей, ваш
серверный скрипт в рамках <b>единой базы транзакции</b> должен выполнять
рокировку по следующей схеме:<o:p></o:p></p>

<ol style='margin-top:0cm' start=1 type=1>
 <li class=MsoNormal style='mso-list:l4 level1 lfo4;tab-stops:list 36.0pt'><b>Поиск
     соседа:</b> Сервер принимает параметры (<span class=SpellE>id</span>, <span
     class=SpellE>old_number</span>, <span class=SpellE>new_number</span>, <span
     class=SpellE>extra_fields</span>) и находит сопутствующую запись, у
     которой поле порядка на текущий момент равно <span class=SpellE>new_number</span>
     (с учетом ограничений из <span class=SpellE>extra_fields</span>).
     Фиксирует её <span class=SpellE>ID_соседа</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l4 level1 lfo4;tab-stops:list 36.0pt'><b>Временный
     буфер<span class=GramE>:<span style='font-weight:normal'> Для</span></span></b>
     <span class=SpellE>ID_соседа</span> устанавливается заведомо недостижимый
     временный порядковый номер (например, 100 000 000). Это освобождает ячейку
     <span class=SpellE>new_number</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l4 level1 lfo4;tab-stops:list 36.0pt'><b>Обновление
     активной строки<span class=GramE>:<span style='font-weight:normal'> Для</span></span></b>
     целевой записи по пришедшему <span class=SpellE>id</span> устанавливается
     значение <span class=SpellE>new_number</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l4 level1 lfo4;tab-stops:list 36.0pt'><b>Закрытие
     рокировки<span class=GramE>:<span style='font-weight:normal'> Для</span></span></b>
     <span class=SpellE>ID_соседа</span> устанавливается значение <span
     class=SpellE>old_number</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l4 level1 lfo4;tab-stops:list 36.0pt'><b>Фиксация
     (<span class=SpellE>Commit</span>):</b> Транзакция закрывается, гарантируя
     атомарность и целостность индексов.<o:p></o:p></li>
</ol>

<div class=MsoNormal align=center style='text-align:center'>

<hr size=1 width="100%" align=center>

</div>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128295;</span> Блок 4: Публичные
методы класса<o:p></o:p></b></p>

<p class=MsoNormal>Эти методы доступны для вызова на экземпляре созданного
класса (например, <span class=SpellE>const</span> <span class=SpellE>table</span>
= <span class=SpellE>new</span> <span class=SpellE>VanillaDataTable</span>(...);
<span class=SpellE><span class=GramE>table.reload</span></span><span
class=GramE>();)</span>.<o:p></o:p></p>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128260;</span></b><b><span
style='mso-ansi-language:EN-US'> <span lang=EN-US>async <span class=GramE>reload(</span><span
class=SpellE>resetPage</span> = true, <span class=SpellE>keepSelection</span> =
false)<o:p></o:p></span></span></b></p>

<p class=MsoNormal>Принудительно запрашивает свежие данные с сервера и
полностью перерисовывает содержимое таблицы.<o:p></o:p></p>

<ul style='margin-top:0cm' type=disc>
 <li class=MsoNormal style='mso-list:l1 level1 lfo5;tab-stops:list 36.0pt'><span
     class=SpellE><b>resetPage</b></span> <i>(<span class=SpellE>Boolean</span>)</i><span
     class=GramE>: При</span> значении <span class=SpellE>true</span>
     сбрасывает пагинацию на 1-ю страницу (используется при новом поиске). При <span
     class=SpellE>false</span> — оставляет пользователя на текущей странице
     (используется при рокировке или точечном изменении данных).<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l1 level1 lfo5;tab-stops:list 36.0pt'><span
     class=SpellE><b>keepSelection</b></span> <i>(<span class=SpellE>Boolean</span>)</i>:
     Умный режим удержания фокуса. Если <span class=SpellE>true</span> (и <span
     class=SpellE>resetPage</span> === <span class=SpellE>false</span>), метод
     перед очисткой DOM запоминает ID текущей выделенной строки, дожидается
     ответа сервера, перерисовывает таблицу и автоматически восстанавливает
     фокус на ней с обновлением всех данных в памяти.<o:p></o:p></li>
</ul>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#127919;</span> <span class=SpellE><span
class=GramE>selectRow</span></span><span class=GramE>(</span><span
class=SpellE>fieldName</span>, <span class=SpellE>value</span>)<o:p></o:p></b></p>

<p class=MsoNormal>Публичный метод-локатор, предназначенный для программного
выделения строки как изнутри внутренних механизмов, так и из внешних скриптов
управления приложением (например, при интеграции со сторонними картами,
деревьями категорий или формами).<o:p></o:p></p>

<ul style='margin-top:0cm' type=disc>
 <li class=MsoNormal style='mso-list:l0 level1 lfo6;tab-stops:list 36.0pt'><span
     class=SpellE><b>fieldName</b></span> <i>(<span class=SpellE>String</span>)</i>:
     Имя ключа объекта, по которому ведется поиск ('<span class=SpellE>id</span>',
     '<span class=SpellE>uuid</span>').<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l0 level1 lfo6;tab-stops:list 36.0pt'><span
     class=SpellE><b>value</b></span> <i>(<span class=SpellE>Any</span>)</i>:
     Искомое значение.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l0 level1 lfo6;tab-stops:list 36.0pt'><b>Возвращает</b>:
     <span class=SpellE>Boolean</span> (<span class=SpellE>true</span> — если
     строка найдена и успешно подсвечена в UI, <span class=SpellE>false</span> —
     если запись на текущей странице отсутствует, при этом внутреннее состояние
     _<span class=SpellE>selectedRowData</span> безопасно очищается).<o:p></o:p></li>
</ul>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#128269;</span></b><b><span
style='mso-ansi-language:EN-US'> <span lang=EN-US>async <span class=SpellE><span
class=GramE>searchAndSelect</span></span><span class=GramE>(</span>id, <span
class=SpellE>keyField</span> = 'id')<o:p></o:p></span></span></b></p>

<p class=MsoNormal>Специализированный метод сквозного поиска. Устанавливает
значение глобального поиска в переданный <span class=SpellE>id</span>,
сбрасывает пагинацию на 1-ю страницу, загружает данные и выполняет <span
class=SpellE>автовыделение</span> найденной строки в UI.<o:p></o:p></p>

<p class=MsoNormal><b><span style='font-family:"Segoe UI Emoji",sans-serif;
mso-bidi-font-family:"Segoe UI Emoji"'>&#129533;</span> <span class=SpellE><span
class=GramE>clearSelection</span></span><span class=GramE>(</span>)<o:p></o:p></b></p>

<p class=MsoNormal><span class=SpellE>Программно</span> сбрасывает текущее
активное выделение строки, удаляет CSS-<span class=GramE>класс .<span
class=SpellE>table</span></span><span class=SpellE>-active</span> у элементов &lt;<span
class=SpellE>tr</span>&gt; (если на них не установлен чекбокс <span
class=SpellE>мультивыбора</span>), очищает переменную состояния и отправляет
управляющим кастомным кнопкам сигнал на блокировку.<o:p></o:p></p>

<div class=MsoNormal align=center style='text-align:center'>

<hr size=1 width="100%" align=center>

</div>

<p class=MsoNormal><b><span style='mso-ascii-font-family:Calibri;mso-hansi-font-family:
Calibri;mso-bidi-font-family:Calibri'>&#129693;</span> Блок 5: Хуки обратного
вызова (<span class=SpellE>Callbacks</span>)<o:p></o:p></b></p>

<ul style='margin-top:0cm' type=disc>
 <li class=MsoNormal style='mso-list:l7 level1 lfo7;tab-stops:list 36.0pt'><span
     class=SpellE><b>fetchDataProvider</b></span> <i>(<span class=SpellE>Function</span>
     | <span class=SpellE>null</span>)</i>: Альтернативный поставщик данных.
     Если передан, класс полностью отказывается от встроенного механизма <span
     class=SpellE>fetch</span>(<span class=SpellE>apiUrl</span>) и вызывает эту
     функцию, передавая в неё объект текущего состояния таблицы (<span
     class=SpellE>page</span>, <span class=SpellE>limit</span>, <span
     class=SpellE>search</span>, <span class=SpellE>sortBy</span>, <span
     class=SpellE>sortDir</span>). Должна возвращать объект формата <span
     class=GramE>{ <span class=SpellE>items</span></span>: [...], <span
     class=SpellE>total</span>: <span class=GramE>Number }</span>.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l7 level1 lfo7;tab-stops:list 36.0pt'><span
     class=SpellE><b>onRowSelect</b></span> <i>(<span class=SpellE>Function</span>
     | <span class=SpellE>null</span>)</i><span class=GramE>: Вызывается</span>
     каждый раз, когда пользователь или система делает строку активной.
     Передает параметры (<span class=SpellE>selectedRowData</span>, <span
     class=SpellE>rowElement</span>).<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l7 level1 lfo7;tab-stops:list 36.0pt'><span
     class=SpellE><b>onClearSelection</b></span> <i>(<span class=SpellE>Function</span>
     | <span class=SpellE>null</span>)</i><span class=GramE>: Вызывается</span>
     в момент полного программного или ручного сброса выделения строки.<o:p></o:p></li>
 <li class=MsoNormal style='mso-list:l7 level1 lfo7;tab-stops:list 36.0pt'><span
     class=SpellE><b>checkRow</b></span> <i>(<span class=SpellE>Function</span>
     | <span class=SpellE>null</span>)</i>: Функция-предикат серверной <span
     class=SpellE>автосинхронизации</span> чекбоксов <span class=SpellE>мультивыбора</span>.
     Вызывается для каждого элемента массива при каждой новой загрузке данных.
     Если возвращает <span class=SpellE>true</span>, строка автоматически
     помечается галочкой и добавляется в карту выбранных элементов.<o:p></o:p></li>
</ul>

<div class=MsoNormal align=center style='text-align:center'>

<hr size=1 width="100%" align=center>

</div>

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
