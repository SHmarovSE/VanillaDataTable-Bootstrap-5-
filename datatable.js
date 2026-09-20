/**
 * Универсальный класс DataTable для Bootstrap 5 без jQuery
 */
class VanillaDataTable {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.config = {
            tableId: options.tableId || null, // Уникальный ID для самой таблицы (необязательно)
            apiUrl: options.apiUrl || '',
            columns: options.columns || [],
            perPageOptions: options.perPageOptions || [10, 25, 50, "all"],
            defaultLimit: options.defaultLimit || 10,
            searchPlaceholder: options.searchPlaceholder || 'Поиск...',
            excelExport: options.excelExport !== false,
            excelPrefix: options.excelPrefix || 'export',
            fetchDataProvider: options.fetchDataProvider || null,
            onRowSelect: options.onRowSelect || null,
            onClearSelection: options.onClearSelection || null, // Хук сброса
            // Чекбоксы выбора в таблице
            checkboxSelect: options.checkboxSelect === true,
            keyField: options.keyField || 'id', // уникальное поле для индексации в Map
            checkRow: options.checkRow || null, // Функция-условие для автовыбора строки
            // НОВИНКА: Новые глобальные свойства управления интерфейсом
            showSearch: options.showSearch !== false, // Дефолт: true
            showFilter: options.showFilter === true,   // Дефолт: false
            // НОВИНКА ДЛЯ ЧАСТИ 4: Настройки для 6 кнопок управления
            showOrderButtons: options.showOrderButtons === true, // кнопки Вверх/Вниз
            // Явно объявляем массив кастомных кнопок по умолчанию
            buttons: options.buttons || [],
            // Поля для перенумерации строк и дополнительные отправляемые поля
            idField: options.idField || options.keyField || 'id', // ФИКС: Явное поле идентификатора строки
            orderField: options.orderField || 'display_order',
            extraFields: options.extraFields || [], // массив строк, например: ['project_id', 'group_id']
            onRenumberRow: options.onRenumberRow || null // хук отправки на бэк
        };

        this.state = {
            page: 1,
            limit: this.config.defaultLimit,
            search: '',
            sortBy: '',  // Имя колонки для сортировки
            sortDir: ''  // Направление: 'ASC' или 'DESC'
        };

        // Внутреннее хранилище для данных ТЕКУЩЕЙ выделенной строки
        this._selectedRowData = null;
        this.searchTimeout = null;
        this._selectedRowsMap = new Map(); // Хранилище под чекбоксы

        this._buildLayout();
        this._bindEvents();
        this.load();
    }

    /**
     * Возвращает данные текущей выбранной строки (включая скрытые поля)
     * @returns {Object|null}
     */
    getSelectedRow() {
        return this._selectedRowData;
    }

    /**
     * Возвращает массив объектов всех выбранных чекбоксами строк
     * @returns {Array<Object>}
     */
    getSelectedRows() {
        return Array.from(this._selectedRowsMap.values());
    }

    /**
     * Сбрасывает выделение строки программно
     */
    clearSelection() {
        this._selectedRowData = null;
        if (this.dom && this.dom.body) {
            // Убираем подсветку только у тех строк, где НЕ стоит чекбокс
            this.dom.body.querySelectorAll('tr').forEach(tr => {
                const cb = tr.querySelector('.dt-row-checkbox');
                if (!cb || !cb.checked) {
                    tr.classList.remove('table-active');
                }
            });
        }

        // Запускаем хук, если он передан
        if (typeof this.config.onClearSelection === 'function') {
            this.config.onClearSelection();
        }
        // Блокируем кнопки обратно, так как выделение сброшено
        this._updateCustomButtonsState();
    }

    /**
     * Полностью сбрасывает все выбранные чекбоксами строки на всех страницах
     */
    clearAllCheckboxes() {
        this._selectedRowsMap.clear(); // Очищаем карту полностью
        if (this.dom && this.dom.body) {
            this.dom.body.querySelectorAll('tr').forEach(tr => tr.classList.remove('table-active'));
            const checkboxes = this.dom.body.querySelectorAll('.dt-row-checkbox');
            checkboxes.forEach(cb => cb.checked = false);
        }
        const selectAll = this.dom.table.querySelector('.dt-select-all');
        if (selectAll) selectAll.checked = false;
    }

    /**
     * Сбрасывает сортировку
     */
    clearSort() {
        this.state.sortBy = '';
        this.state.sortDir = '';

        if (this.dom && this.dom.table) {
            const headers = this.dom.table.querySelectorAll('.dt-th-sortable');
            headers.forEach(th => {
                th.classList.remove('dt-sort-asc', 'dt-sort-desc');
            });
        }
    }

    /**
     * Принудительно перезагружает данные с сервера и перерисовывает таблицу.
     * @param {boolean} resetPage - Если true, сбросит пагинацию на 1-ю страницу.
     * @param {boolean} keepSelection - Если true, попытается сохранить фокус на текущей строке (работает только при resetPage = false).
     */
    async reload(resetPage = true, keepSelection = false) {
        let targetIdToRestore = null;
        const idField = this.config.idField;

        // Проверяем: если нужно сохранить выделение И мы НЕ сбрасываем страницу
        if (!resetPage && keepSelection && this._selectedRowData) {
            // Запоминаем уникальный ID строки ДО обновления данных
            targetIdToRestore = this._selectedRowData[idField];
        }

        if (resetPage) {
            this.state.page = 1;
        }

        // Сбрасываем текущее выделение (очистит подсветку и вызовет хук onClearSelection)
        this.clearSelection();

        // Вызываем базовый асинхронный метод загрузки и генерации DOM таблицы
        await this.load();

        // ЖЕСТКОЕ УСЛОВИЕ: Восстанавливаем фокус только если страница не сброшена и был сохранен ID
        if (!resetPage && keepSelection && targetIdToRestore !== null) {
            // Вызываем наш новый публичный метод переиспользования
            this.selectRow(idField, targetIdToRestore);
        }
    }


    /**
     * Находит запись через встроенный поиск по ID и автоматически выделяет её
     */
    async searchAndSelect(id, keyField = 'id') {
        this.state.search = String(id);
        this.state.page = 1;

        if (this.dom.search) {
            this.dom.search.value = String(id);
        }

        this.clearSelection();
        await this.load();

        if (this.dom && this.dom.body) {
            const rows = this.dom.body.querySelectorAll('tr');
            for (const row of rows) {
                if (row.dataset.row) {
                    try {
                        const rowData = JSON.parse(row.dataset.row);
                        if (rowData && String(rowData[keyField]) === String(id)) {
                            row.classList.add('table-active');
                            this._selectedRowData = rowData;

                            if (typeof this.config.onRowSelect === 'function') {
                                this.config.onRowSelect(this._selectedRowData, row);
                            }
                            break;
                        }
                    } catch (e) {
                        console.error("Ошибка автовыделения после поиска:", e);
                    }
                }
            }
        }
    }

    /**
     * Публичный метод для выделения строки по любому полю и значению.
     * Доступен как внутри класса, так и для внешнего использования.
     * @param {string} fieldName - Имя поля для поиска (например, 'id' или 'uuid')
     * @param {any} value - Значение, которое ищем
     * @returns {boolean} - true, если строка найдена и выделена, иначе false
     */
    selectRow(fieldName, value) {
        if (!this.dom || !this.dom.body) return false;

        // Находим все физические строки в текущем tbody
        const rows = this.dom.body.querySelectorAll('tr');
        let foundData = null;
        let foundRowElement = null;

        // Сначала убираем старую подсветку со всех строк таблицы
        rows.forEach(tr => tr.classList.remove('table-active'));

        // Перебираем строки и ищем совпадение по data-row атрибуту
        for (const row of rows) {
            if (row.dataset.row) {
                try {
                    const rowData = JSON.parse(row.dataset.row);
                    // Сверяем приведенные к строке значения, чтобы избежать проблем с типами (int vs string)
                    if (rowData && String(rowData[fieldName]) === String(value)) {
                        foundData = rowData;
                        foundRowElement = row;
                        break; // Строка найдена, выходим из цикла
                    }
                } catch (e) {
                    console.error("Ошибка парсинга данных строки при выделении:", e);
                }
            }
        }

        // Если строка успешно найдена на текущей странице
        if (foundData && foundRowElement) {
            foundRowElement.classList.add('table-active'); // Подсвечиваем в UI
            this._selectedRowData = foundData; // Обновляем данные в памяти (уже с новым порядком из БД!)

            // Если у разработчика при инициализации задан хук на выбор строки, триггерим его
            if (typeof this.config.onRowSelect === 'function') {
                this.config.onRowSelect(this._selectedRowData, foundRowElement);
            }
            this._updateCustomButtonsState();
            return true;
        }

        // РЕШЕНИЕ: Если строка НЕ найдена на текущей странице — полностью очищаем состояние
        this._selectedRowData = null;
        this._updateCustomButtonsState();
        return false;

    }

    _buildLayout() {
        const limitOptionsHtml = this.config.perPageOptions
            .map(opt => {
                if (opt === "all") {
                    return `<option value="10000" ${this.state.limit === 10000 ? 'selected' : ''}>Все</option>`;
                }
                return `<option value="${opt}" ${opt === this.state.limit ? 'selected' : ''}>${opt} строк</option>`;
            }).join('');

        let headersHtml = this.config.columns
            .filter(col => col.visible !== false)
            .map(col => {
                if (col.sortable === true) {
                    let sortClass = '';
                    if (this.state.sortBy === col.field) {
                        sortClass = this.state.sortDir === 'ASC' ? 'dt-sort-asc' : 'dt-sort-desc';
                    }
                    return `<th scope="col" class="dt-th-sortable ${sortClass}" data-field="${col.field}" style="cursor: pointer; user-select: none;">${col.title}</th>`;
                }
                return `<th scope="col">${col.title}</th>`;
            }).join('');

        if (this.config.checkboxSelect) {
            headersHtml = `<th scope="col" style="width: 40px; text-align: center;"><input type="checkbox" class="form-check-input dt-select-all"></th>` + headersHtml;
        }

        // Динамическое создание кнопок
        const hasSelection = this._selectedRowData !== null;

        const dynamicButtonsHtml = (this.config.buttons || []).map((btn, btnIdx) => {
            const customClass = btn.className || 'btn-outline-secondary';

            if (btn.type === 'button') {
                const isDisabled = btn.requiresSelection && !hasSelection;
                const disabledAttr = isDisabled ? 'disabled' : '';
                const disabledClass = isDisabled ? 'disabled' : '';
                const titleAttr = btn.title ? `title="${btn.title}"` : '';

                return `
            <button type="button" 
                    class="btn btn-sm ${customClass} ${disabledClass} dt-custom-btn" 
                    data-btn-idx="${btnIdx}" 
                    ${disabledAttr} 
                    ${titleAttr}>
                ${btn.label}
            </button>
        `;
            }

            if (btn.type === 'dropdown') {
                const titleAttr = btn.title ? `title="${btn.title}"` : '';

                const menuItemsHtml = (btn.items || []).map((item, itemIdx) => {
                    if (item.type === 'divider') {
                        return `<li><hr class="dropdown-divider"></li>`;
                    }

                    const isItemDisabled = item.requiresSelection && !hasSelection;
                    const itemDisabledClass = isItemDisabled ? 'disabled' : '';
                    const itemTitleAttr = item.title ? `title="${item.title}"` : '';
                    const itemCustomClass = item.className || '';

                    return `
                <li>
                    <button type="button" 
                            class="dropdown-item ${itemDisabledClass} ${itemCustomClass} dt-custom-sub-btn" 
                            data-btn-idx="${btnIdx}" 
                            data-item-idx="${itemIdx}" 
                            ${itemTitleAttr}>
                        ${item.label}
                    </button>
                </li>
            `;
                }).join('');

                const allItemsRequireSelection = (btn.items || []).every(item => item.type === 'divider' || item.requiresSelection);
                const isDropdownDisabled = allItemsRequireSelection && !hasSelection;
                const dropDisabledAttr = isDropdownDisabled ? 'disabled' : '';
                const dropDisabledClass = isDropdownDisabled ? 'disabled' : '';

                return `
            <div class="dropdown d-inline-block" style="z-index: 1025;">
                <button type="button" 
                        class="btn btn-sm ${customClass} dropdown-toggle ${dropDisabledClass}" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                        ${dropDisabledAttr} 
                        ${titleAttr}>
                    ${btn.label}
                </button>
                <ul class="dropdown-menu shadow-sm">
                    ${menuItemsHtml}
                </ul>
            </div>
        `;
            }
            return '';
        }).join('');

        const showOrderGroup = this.config.showOrderButtons ? '' : 'd-none';

        let actionButtonsHtml = `
            <div class="col-sm-auto d-flex gap-2 flex-wrap order-actions-panel">
                <div class="btn-group ${showOrderGroup}" role="group">
                    <button type="button" class="btn btn-sm btn-outline-secondary row-order-up" title="Переместить вверх">
                        <i class="bi bi-arrow-up"></i> Вверх
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary row-order-down" title="Переместить вниз">
                        <i class="bi bi-arrow-down"></i> Вниз
                    </button>
                </div>
                ${dynamicButtonsHtml}
            </div>
        `;

        let searchBlockHtml = this.config.showSearch ? `<div class="col-sm-3"><input type="search" class="form-control form-control-sm dt-search" placeholder="${this.config.searchPlaceholder}"></div>` : '';
        let filterBlockHtml = this.config.showFilter ? `<div class="col-sm-auto"><button type="button" class="btn btn-sm btn-outline-secondary w-100 dt-toggle-filters" data-active="false"><i class="bi bi-funnel"></i> Панель фильтров</button></div>` : '';
        let limitClass = 'col-sm-auto';
        const idAttribute = this.config.tableId ? `id="${this.config.tableId}"` : '';

        this.container.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="vanilla-datatable">
                    <div class="row g-2 mb-3 align-items-center">
                        ${actionButtonsHtml}
                        ${searchBlockHtml}
                        ${filterBlockHtml}
                        <div class="${limitClass}">
                            <select class="form-select form-select-sm dt-limit">${limitOptionsHtml}</select>
                        </div>
                        <div class="col-sm col-text-end text-sm-end">
                            ${this.config.excelExport ? '<button class="btn btn-outline-success btn-sm dt-export"><i class="bi bi-file-earmark-excel-fill"></i> Экспорт в Excel</button>' : ''}
                        </div>
                    </div>
                    <div class="table-responsive position-relative dt-table-container">
                        <div class="position-absolute top-50 start-50 translate-middle d-none dt-spinner" style="z-index: 3;">
                            <div class="spinner-border text-primary" role="status"></div>
                        </div>
                        <table ${idAttribute} class="table table-sm table-hover align-middle mb-0">
                            <thead class="table-dark sticky-top">
                                <tr>${headersHtml}</tr>
                                <tr class="dt-filters-row d-none bg-secondary bg-opacity-10"></tr>
                            </thead>
                            <tbody class="dt-body"></tbody>
                        </table>
                    </div>
                    <div class="row mt-3 align-items-center">
                        <div class="col-sm-6 text-muted small dt-info">Показано 0-0 из 0 записей</div>
                        <div class="col-sm-6">
                            <nav aria-label="Навигация">
                                <ul class="pagination pagination-sm justify-content-sm-end mb-0 dt-pagination"></ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

        // Сохраняем ссылки на новые DOM элементы
        this.dom = {
            search: this.container.querySelector('.dt-search'),
            toggleFilters: this.container.querySelector('.dt-toggle-filters'),
            limit: this.container.querySelector('.dt-limit'),
            exportBtn: this.container.querySelector('.dt-export'),
            spinner: this.container.querySelector('.dt-spinner'),
            body: this.container.querySelector('.dt-body'),
            info: this.container.querySelector('.dt-info'),
            pagination: this.container.querySelector('.dt-pagination'),
            table: this.container.querySelector('table'),
            filtersRow: this.container.querySelector('.dt-filters-row'),
            // Ссылки на кнопки перемещения порядка
            btnOrderUp: this.container.querySelector('.row-order-up'),
            btnOrderDown: this.container.querySelector('.row-order-down')
        };
    }



    _bindEvents() {
        if (this.dom.search) {
            this.dom.search.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.state.search = e.target.value.trim();
                    this.state.page = 1;
                    this.clearSelection();
                    this.load();
                }, 400);
            });
        }

        this.dom.limit.addEventListener('change', (e) => {
            this.state.limit = parseInt(e.target.value, 10);
            this.state.page = 1;
            this.clearSelection();
            this.load();
        });

        // Слушатель кнопки фильтров (вешается только если панель фильтров включена)
        if (this.dom.toggleFilters) {
            this.dom.toggleFilters.addEventListener('click', async (e) => {
                const btn = e.currentTarget;
                const isClientFilterMode = btn.dataset.active === 'false';

                if (isClientFilterMode) {
                    // Включаем режим локальной фильтрации:
                    btn.dataset.active = 'true';
                    btn.classList.remove('btn-outline-secondary');
                    btn.classList.add('btn-dark');
                    btn.innerHTML = '<i class="bi bi-funnel-fill"></i> Фильтры: Вкл.';

                    // БЕЗОПАСНОСТЬ: Очищаем и блокируем поиск только если он есть в DOM
                    if (this.dom.search) {
                        this.dom.search.value = '';
                        this.dom.search.disabled = true;
                    }
                    this.state.search = '';

                    this.dom.limit.value = '10000';
                    this.state.limit = 10000;

                    // Показываем строку фильтров и генерируем её содержимое
                    if (this.dom.filtersRow) {
                        this.dom.filtersRow.classList.remove('d-none');
                        this._renderFiltersRow();
                    }
                } else {
                    // Выключаем режим локальной фильтрации:
                    btn.dataset.active = 'false';
                    btn.classList.remove('btn-dark');
                    btn.classList.add('btn-outline-secondary');
                    btn.innerHTML = '<i class="bi bi-funnel"></i> Панель фильтров';

                    // БЕЗОПАСНОСТЬ: Разблокируем поиск только если он существует
                    if (this.dom.search) {
                        this.dom.search.disabled = false;
                    }

                    this.dom.limit.value = String(this.config.defaultLimit);
                    this.state.limit = this.config.defaultLimit;

                    // Скрываем и полностью очищаем строку фильтров
                    if (this.dom.filtersRow) {
                        this.dom.filtersRow.classList.add('d-none');
                        this.dom.filtersRow.innerHTML = '';
                    }
                }

                this.state.page = 1;
                this.clearSelection();

                // Дожидаемся полной выгрузки 10 000 записей с сервера
                await this.load();

                // Если режим фильтров включен — наполняем селекты уникальными данными
                if (btn.dataset.active === 'true') {
                    this._populateSelectFilters();
                }
            });
        }


        this.dom.pagination.addEventListener('click', (e) => {
            const btn = e.target.closest('.page-link-btn');
            if (btn && !btn.parentElement.classList.contains('disabled')) {
                this.state.page = parseInt(btn.dataset.page, 10);
                this.clearSelection();
                this.load();
            }
        });

        if (this.dom.exportBtn) {
            this.dom.exportBtn.addEventListener('click', () => this.exportToExcel());
        }

        // Делегирование клика по строкам в tbody
        this.dom.body.addEventListener('click', (e) => {
            if (e.target.closest('.dt-row-checkbox')) return;

            const row = e.target.closest('tr');
            if (row && row.dataset.row) {
                this.dom.body.querySelectorAll('tr').forEach(tr => tr.classList.remove('table-active'));
                row.classList.add('table-active');

                this._selectedRowData = JSON.parse(row.dataset.row);
                if (typeof this.config.onRowSelect === 'function') {
                    this.config.onRowSelect(this._selectedRowData, row);
                }
                // Мгновенно разблокируем кнопки, так как строка выделена
                this._updateCustomButtonsState();
            }
        });

        // Обработка сортировки в thead
        const thead = this.dom.table.querySelector('thead');
        thead.addEventListener('click', (e) => {
            const th = e.target.closest('.dt-th-sortable');
            if (!th) return;

            const field = th.dataset.field;

            this.dom.table.querySelectorAll('.dt-th-sortable').forEach(header => {
                if (header !== th) header.classList.remove('dt-sort-asc', 'dt-sort-desc');
            });

            if (this.state.sortBy === field) {
                if (this.state.sortDir === 'ASC') {
                    this.state.sortDir = 'DESC';
                    th.classList.remove('dt-sort-asc');
                    th.classList.add('dt-sort-desc');
                } else if (this.state.sortDir === 'DESC') {
                    this.state.sortBy = '';
                    this.state.sortDir = '';
                    th.classList.remove('dt-sort-desc');
                }
            } else {
                this.state.sortBy = field;
                this.state.sortDir = 'ASC';
                th.classList.add('dt-sort-asc');
            }

            this.state.page = 1;
            this.clearSelection();
            this.load();
        });

        // Чекбокс "Выбрать все" с исправленным селектором
        thead.addEventListener('change', (e) => {
            if (e.target.classList.contains('dt-select-all')) {
                const isChecked = e.target.checked;
                const checkboxes = this.dom.body.querySelectorAll('.dt-row-checkbox');

                checkboxes.forEach(cb => {
                    cb.checked = isChecked;
                    const row = cb.closest('tr');
                    if (row && row.dataset.row) {
                        const rowData = JSON.parse(row.dataset.row);
                        const itemId = rowData[this.config.keyField];

                        if (isChecked) {
                            this._selectedRowsMap.set(itemId, rowData);
                            row.classList.add('table-active');
                        } else {
                            this._selectedRowsMap.delete(itemId);
                            row.classList.remove('table-active');
                        }
                    }
                });
                this._updateInfoCounter();
            }
        });

        // Клики по чекбоксам в строках
        this.dom.body.addEventListener('change', (e) => {
            if (e.target.classList.contains('dt-row-checkbox')) {
                const cb = e.target;
                const row = cb.closest('tr');
                if (row && row.dataset.row) {
                    const rowData = JSON.parse(row.dataset.row);
                    const itemId = rowData[this.config.keyField];

                    if (cb.checked) {
                        this._selectedRowsMap.set(itemId, rowData);
                        row.classList.add('table-active');
                    } else {
                        this._selectedRowsMap.delete(itemId);
                        row.classList.remove('table-active');

                        const selectAll = this.dom.table.querySelector('.dt-select-all');
                        if (selectAll) selectAll.checked = false;
                    }
                }
                this._updateInfoCounter();
            }
        });

        // Клик по ссылке "Очистить"
        this.dom.info.addEventListener('click', (e) => {
            if (e.target.classList.contains('dt-clear-selected-link')) {
                e.preventDefault();
                this.clearAllCheckboxes();
                this._updateInfoCounter();
            }
        });

        // Делегирование события ввода текста в инпуты локальной фильтрации
        // Универсальный обработчик для текстовых инпутов (input) и выпадающих списков (change)
        ['input', 'change'].forEach(eventType => {
            this.dom.table.querySelector('thead').addEventListener(eventType, (e) => {
                if (e.target.classList.contains('dt-column-filter')) {
                    // Запускаем локальную фильтрацию при любом изменении значений
                    this._applyClientFilters();
                }
            });
        });

        // Добавление в метод _bindEvents() для обработки кликов по кнопкам порядка

        const handleOrderChange = async (direction) => {
            // 1. Проверяем, выбрана ли строка и есть ли колбэк
            if (!this._selectedRowData || typeof this.config.onRenumberRow !== 'function') return;

            const items = this.state.currentItems || []; //
            const idField = this.config.idField; // Теперь берем строго из настроек перенумерации
            const orderField = this.config.orderField;

            // 2. Находим текущий индекс строки в массиве на странице
            const currentIndex = items.findIndex(item => String(item[idField]) === String(this._selectedRowData[idField]));
            if (currentIndex === -1) return;

            // Проверяем границы: нельзя идти выше первой строки или ниже последней
            if (direction === 'up' && currentIndex === 0) return;
            if (direction === 'down' && currentIndex === items.length - 1) return;

            // 3. Вычисляем старый и новый порядок
            const oldNumber = parseInt(this._selectedRowData[orderField], 10) || 0;
            const newNumber = direction === 'up' ? oldNumber - 1 : oldNumber + 1;

            // 4. Формируем плоский результирующий объект
            const resultPayload = {
                id: String(this._selectedRowData[idField]),
                old_number: String(oldNumber),
                new_number: String(newNumber)
            };

            // Динамически подмешиваем дополнительные поля из extraFields, если они есть в объекте
            if (Array.isArray(this.config.extraFields)) {
                this.config.extraFields.forEach(field => {
                    if (this._selectedRowData[field] !== undefined) {
                        resultPayload[field] = String(this._selectedRowData[field]);
                    }
                });
            }

            // 5. Отправляем на бэк и дожидаемся успеха
            this._toggleLoader(true); //
            try {
                const success = await this.config.onRenumberRow(resultPayload);
                if (success === true) {
                    // ФИКС ИЗ ЧАСТИ 3: перезагружаем данные без сброса страницы пагинации
                    await this.reload(false, true); //
                }
            } catch (err) {
                console.error("Ошибка при перенумерации строки:", err);
            } finally {
                this._toggleLoader(false); //
            }
        };

        // Вешаем события на кнопки, если они отрисованы в DOM
        if (this.dom.btnOrderUp) {
            this.dom.btnOrderUp.addEventListener('click', () => handleOrderChange('up'));
        }
        if (this.dom.btnOrderDown) {
            this.dom.btnOrderDown.addEventListener('click', () => handleOrderChange('down'));
        }

        // Добавление в метод _bindEvents() для оживления кастомных кнопок и дропдаунов

        // Находим общую панель, где лежат все кнопки управления
        const actionsPanel = this.container.querySelector('.order-actions-panel');

        if (actionsPanel) {
            actionsPanel.addEventListener('click', (e) => {
                // Ищем, был ли клик по одиночной кнопке или по пункту дропдауна
                const customBtn = e.target.closest('.dt-custom-btn');
                const customSubBtn = e.target.closest('.dt-custom-sub-btn');

                // Если элемент заблокирован (имеет класс disabled), игнорируем клик
                if ((customBtn && customBtn.classList.contains('disabled')) ||
                    (customSubBtn && customSubBtn.classList.contains('disabled'))) {
                    return;
                }

                let btnConfig = null;
                let actionFn = null;

                // --- СЦЕНАРИЙ 1: КЛИК ПО ОДИНОЧНОЙ КНОПКЕ ---
                if (customBtn) {
                    const btnIdx = parseInt(customBtn.dataset.btnIdx, 10);
                    btnConfig = (this.config.buttons || [])[btnIdx];
                    actionFn = btnConfig ? btnConfig.action : null;
                }

                // --- СЦЕНАРИЙ 2: КЛИК ПО ПУНКТУ МЕНЮ ДРОПДАУНА ---
                else if (customSubBtn) {
                    const btnIdx = parseInt(customSubBtn.dataset.btnIdx, 10);
                    const itemIdx = parseInt(customSubBtn.dataset.itemIdx, 10);
                    btnConfig = (this.config.buttons || [])[btnIdx];
                    const itemConfig = btnConfig && btnConfig.items ? btnConfig.items[itemIdx] : null;
                    actionFn = itemConfig ? itemConfig.action : null;
                }

                // Если нашли сконфигурированную функцию action, вызываем её
                if (typeof actionFn === 'function') {
                    let targetRowElement = null;

                    // Если строка выделена, находим её физический TR элемент на странице для передачи в колбэк
                    if (this._selectedRowData && this.dom && this.dom.body) {
                        const idField = this.config.idField;
                        const targetId = this._selectedRowData[idField];

                        // Пробегаемся по строкам текущей страницы, чтобы найти нужный TR
                        const rows = this.dom.body.querySelectorAll('tr');
                        for (const tr of rows) {
                            if (tr.dataset.row) {
                                try {
                                    const rowData = JSON.parse(tr.dataset.row);
                                    if (rowData && String(rowData[idField]) === String(targetId)) {
                                        targetRowElement = tr;
                                        break;
                                    }
                                } catch (err) {
                                    console.error("Ошибка парсинга строки при вызове кнопки:", err);
                                }
                            }
                        }
                    }

                    // Вызываем кастомный action разработчика, передавая данные строки и элемент TR
                    actionFn(this._selectedRowData, targetRowElement);
                }
            });
        }


    }

    async load() {
        this._toggleLoader(true);
        try {
            let data;
            if (this.config.fetchDataProvider) {
                data = await this.config.fetchDataProvider(this.state);
            } else {
                const params = new URLSearchParams({
                    page: this.state.page,
                    limit: this.state.limit,
                    search: this.state.search,
                    sort_by: this.state.sortBy,
                    sort_dir: this.state.sortDir
                });

                const separator = this.config.apiUrl.includes('?') ? '&' : '?';
                const fullUrl = `${this.config.apiUrl}${separator}${params.toString()}`;
                const response = await fetch(fullUrl);

                if (!response.ok) {
                    let errorText = 'Сетевая ошибка';
                    try {
                        const errorJson = await response.json();
                        if (errorJson && errorJson.message) {
                            errorText = errorJson.message;
                        }
                    } catch (e) {
                        errorText = `Ошибка сервера (статус ${response.status})`;
                    }
                    throw new Error(errorText);
                }
                data = await response.json();
            }

            this.state.currentItems = data.items || [];

            // ФИКС: Динамическая синхронизация Map на основе checkRow
            if (typeof this.config.checkRow === 'function') {
                this.state.currentItems.forEach(item => {
                    const itemId = item[this.config.keyField];
                    if (this.config.checkRow(item)) {
                        // Если условие выполняется — сохраняем/обновляем в Map
                        this._selectedRowsMap.set(itemId, item);
                    } else {
                        // Если условие больше не выполняется (например, заблокирован) — убираем чекбокс
                        this._selectedRowsMap.delete(itemId);
                    }
                });
            }

            this._renderTable(this.state.currentItems);
            this._renderPagination(data.total || 0);
            this._renderInfo(data.total || 0, this.state.currentItems.length);
        } catch (error) {
            console.error("DataTable Error:", error);
            const visibleCount = this.config.columns.filter(c => c.visible !== false).length + (this.config.checkboxSelect ? 1 : 0);
            const displayMessage = error.message && error.message !== 'Failed to fetch'
                ? `Ошибка загрузки данных: ${error.message}`
                : 'Ошибка загрузки данных (проверьте сетевое соединение)';

            this.dom.body.innerHTML = `<tr><td colspan="${visibleCount}" class="text-center text-danger py-3">${displayMessage}</td></tr>`;
        } finally {
            this._toggleLoader(false);
        }
    }


    _renderTable(items, msg = '') {
        const visibleColumns = this.config.columns.filter(col => col.visible !== false);

        if (items.length === 0) {
            const colSpan = visibleColumns.length + (this.config.checkboxSelect ? 1 : 0);
            this.dom.body.innerHTML = `<tr><td colspan="${colSpan}" class="text-center py-4 text-muted">Записи не найдены. <br> ${msg}</td></tr>`;
            return;
        }

        this.dom.body.innerHTML = items.map(item => {
            const stringifiedRow = JSON.stringify(item).replace(/"/g, '&quot;');
            const itemId = item[this.config.keyField];
            const isChecked = this._selectedRowsMap.has(itemId);

            let cells = visibleColumns.map(col => {
                const value = col.render ? col.render(item[col.field], item) : (item[col.field] ?? '');
                return `<td>${value}</td>`;
            }).join('');

            if (this.config.checkboxSelect) {
                cells = `<td style="text-align: center;"><input type="checkbox" class="form-check-input dt-row-checkbox" data-id="${itemId}" ${isChecked ? 'checked' : ''}></td>` + cells;
            }

            const activeClass = isChecked || (this._selectedRowData && String(this._selectedRowData[this.config.keyField]) === String(itemId)) ? 'table-active' : '';

            return `<tr style="cursor: pointer;" class="${activeClass}" data-row="${stringifiedRow}">${cells}</tr>`;
        }).join('');

        if (this.config.checkboxSelect && this.dom && this.dom.table) {
            const selectAllCb = this.dom.table.querySelector('.dt-select-all');
            if (selectAllCb) {
                const pageCheckboxes = this.dom.body.querySelectorAll('.dt-row-checkbox');
                selectAllCb.checked = pageCheckboxes.length > 0 && Array.from(pageCheckboxes).every(cb => cb.checked);
            }
        }
    }

    /**
     * Динамически генерирует инпуты типа search и заготовки select в шапке таблицы
     */
    _renderFiltersRow() {
        if (!this.dom.filtersRow) return;

        const visibleColumns = this.config.columns.filter(col => col.visible !== false);
        let cellsHtml = '';

        // 1. Техническая пустая ячейка под чекбокс мультивыбора
        if (this.config.checkboxSelect) {
            cellsHtml += '<th style="width: 40px; background-color: #f8f9fa;"></th>';
        }

        // 2. Генерируем элементы фильтрации на основе конфига колонок
        cellsHtml += visibleColumns.map(col => {
            if (col.filter === 'none') {
                return '<th style="background-color: #f8f9fa;"></th>';
            }

            // Новинка: если указан select — генерируем пустой выпадающий список
            if (col.filter === 'select') {
                return `
          <th style="background-color: #f8f9fa; padding: 5px 8px;">
            <select class="form-select form-select-sm dt-column-filter" 
                    data-field="${col.field}" 
                    style="font-weight: normal; font-size: 0.8rem; height: 28px; padding: 2px 6px;">
              <option value="">Все</option>
            </select>
          </th>
        `;
            }

            // Изменение: меняем тип на "search" для текстовых фильтров по умолчанию
            return `
        <th style="background-color: #f8f9fa; padding: 5px 8px;">
          <input type="search" 
                 class="form-control form-control-sm dt-column-filter" 
                 data-field="${col.field}" 
                 placeholder="Фильтр..."
                 style="font-weight: normal; font-size: 0.8rem; height: 28px; padding: 2px 6px;">
        </th>
      `;
        }).join('');

        this.dom.filtersRow.innerHTML = cellsHtml;
    }

    /**
     * Сканирует загруженные данные, собирает уникальные значения и наполняет селекты в шапке
     */
    _populateSelectFilters() {
        // Находим все селекты фильтрации, которые сейчас есть в DOM шапки
        const selectFilters = this.dom.filtersRow.querySelectorAll('select.dt-column-filter');
        if (selectFilters.length === 0) return;

        selectFilters.forEach(select => {
            const field = select.dataset.field;
            // Запоминаем текущее выбранное пользователем значение, чтобы не сбросить его
            const currentValue = select.value;

            // С помощью Set собираем строго уникальные и непустые значения из всего массива данных
            const uniqueValues = new Set();
            this.state.currentItems.forEach(item => {
                const val = item[field];
                if (val !== undefined && val !== null && String(val).trim() !== '') {
                    uniqueValues.add(String(val).trim());
                }
            });

            // Переводим в массив и сортируем по алфавиту/числам для аккуратного вида
            const sortedValues = Array.from(uniqueValues).sort((a, b) => {
                return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
            });

            // Генерируем HTML опций, сохраняя дефолтный пункт "Все"
            let optionsHtml = '<option value="">Все</option>';
            optionsHtml += sortedValues.map(val => {
                // Если значение совпадает с тем, что пользователь уже выбрал — ставим active/selected
                const isSelected = val === currentValue ? 'selected' : '';
                return `<option value="${val}" ${isSelected}>${val}</option>`;
            }).join('');

            select.innerHTML = optionsHtml;
        });
    }


    /**
     * Выполняет мгновенную локальную фильтрацию массива данных в памяти (In-Memory)
     */
    _applyClientFilters() {
        // 1. Собираем все инпуты фильтров, которые сейчас отрисованы в шапке
        const filterInputs = this.dom.filtersRow.querySelectorAll('.dt-column-filter');
        const activeFilters = {};

        // 2. Формируем карту активных фильтров (поле -> значение в нижнем регистре)
        filterInputs.forEach(input => {
            const field = input.dataset.field;
            const val = input.value.trim().toLowerCase();
            if (val) {
                activeFilters[field] = val;
            }
        });

        // 3. Если ни один инпут не заполнен — просто рендерим исходный массив
        if (Object.keys(activeFilters).length === 0) {
            this._renderTable(this.state.currentItems);
            this._renderInfo(this.state.currentItems.length, this.state.currentItems.length);
            return;
        }

        // 4. Фильтруем массив: строка должна удовлетворять ВСЕМ заполненным полям одновременно
        const filteredItems = this.state.currentItems.filter(item => {
            return Object.entries(activeFilters).every(([field, searchStr]) => {
                const cellValue = item[field];
                if (cellValue === undefined || cellValue === null) return false;

                return String(cellValue).toLowerCase().includes(searchStr);
            });
        });

        // 5. Отрисовываем отфильтрованный результат и обновляем счетчик записей
        this._renderTable(filteredItems);
        this._renderInfo(filteredItems.length, filteredItems.length);
    }


    _renderPagination(total) {
        const totalPages = Math.ceil(total / this.state.limit);

        if (totalPages <= 1) {
            this.dom.pagination.innerHTML = '';
            return;
        }

        let html = `
      <li class="page-item ${this.state.page === 1 ? 'disabled' : ''}">
        <button class="page-link page-link-btn" data-page="${this.state.page - 1}">&laquo;</button>
      </li>
    `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(this.state.page - i) <= 1) {
                html += `
          <li class="page-item ${this.state.page === i ? 'active' : ''}">
            <button class="page-link page-link-btn" data-page="${i}">${i}</button>
          </li>
        `;
            } else if (i === 2 || i === totalPages - 1) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        html += `
      <li class="page-item ${this.state.page === totalPages ? 'disabled' : ''}">
        <button class="page-link page-link-btn" data-page="${this.state.page + 1}">&raquo;</button>
      </li>
    `;

        this.dom.pagination.innerHTML = html;
    }

    _renderInfo(total, currentCount) {
        if (total === 0) {
            this.dom.info.textContent = "Записи отсутствуют";
            return;
        }

        const start = (this.state.page - 1) * this.state.limit + 1;
        const end = start + currentCount - 1;
        let infoText = `Показано с ${start} по ${end} из ${total} записей`;

        if (this.config.checkboxSelect && this._selectedRowsMap && this._selectedRowsMap.size > 0) {
            infoText += ` <span class="ms-2 text-primary font-weight-bold">(Выбрано: ${this._selectedRowsMap.size})</span>` +
                `<a href="#" class="ms-2 text-danger small dt-clear-selected-link" style="text-decoration: none;">Очистить</a>`;
        }

        this.dom.info.innerHTML = infoText;
    }

    _updateInfoCounter() {
        if (!this.dom.info) return;
        const baseText = this.dom.info.innerHTML.split('<span')[0].trim();
        let infoText = baseText;

        if (this.config.checkboxSelect && this._selectedRowsMap && this._selectedRowsMap.size > 0) {
            infoText += ` <span class="ms-2 text-primary">(Выбрано: ${this._selectedRowsMap.size})</span>` +
                `<a href="#" class="ms-2 text-danger small dt-clear-selected-link" style="text-decoration: none;">Очистить</a>`;
        }

        this.dom.info.innerHTML = infoText;
    }

    _toggleLoader(show) {
        if (!this.dom.spinner) return;
        if (show) {
            this.dom.spinner.classList.remove('d-none');
            this.dom.body.style.opacity = '0.3';
        } else {
            this.dom.spinner.classList.add('d-none');
            this.dom.body.style.opacity = '1';
        }
    }

    /**
     * Внутренний метод для динамического переключения состояний (disabled)
     * кастомных кнопок и дропдаунов на панели управления.
     * Вызывается автоматически при изменении выделения строк.
     */
    _updateCustomButtonsState() {
        if (!this.container) return;

        // 1. Проверяем, есть ли выделенная строка в памяти прямо сейчас
        const hasSelection = this._selectedRowData !== null;

        // 2. Обновляем одиночные кастомные кнопки (.dt-custom-btn)
        const customButtons = this.container.querySelectorAll('.dt-custom-btn');
        customButtons.forEach(btnElement => {
            const btnIdx = parseInt(btnElement.dataset.btnIdx, 10);
            const btnConfig = (this.config.buttons || [])[btnIdx];

            if (btnConfig && btnConfig.requiresSelection) {
                if (hasSelection) {
                    btnElement.removeAttribute('disabled');
                    btnElement.classList.remove('disabled');
                } else {
                    btnElement.setAttribute('disabled', 'true');
                    btnElement.classList.add('disabled');
                }
            }
        });

        // 3. Обновляем вложенные пункты меню внутри дропдаунов (.dt-custom-sub-btn)
        const customSubButtons = this.container.querySelectorAll('.dt-custom-sub-btn');
        customSubButtons.forEach(subBtnElement => {
            const btnIdx = parseInt(subBtnElement.dataset.btnIdx, 10);
            const itemIdx = parseInt(subBtnElement.dataset.itemIdx, 10);

            const btnConfig = (this.config.buttons || [])[btnIdx];
            const itemConfig = btnConfig && btnConfig.items ? btnConfig.items[itemIdx] : null;

            if (itemConfig && itemConfig.requiresSelection) {
                if (hasSelection) {
                    subBtnElement.removeAttribute('disabled');
                    subBtnElement.classList.remove('disabled');
                } else {
                    subBtnElement.setAttribute('disabled', 'true');
                    subBtnElement.classList.add('disabled');
                }
            }
        });

        // 4. Обновляем главные кнопки-триггеры дропдаунов (.dropdown-toggle)
        // Находим все блоки dropdown на панели
        const dropdownContainers = this.container.querySelectorAll('.dropdown');
        dropdownContainers.forEach(dropdown => {
            const toggleButton = dropdown.querySelector('.dropdown-toggle');
            if (!toggleButton) return;

            const btnIdx = parseInt(toggleButton.dataset.btnIdx || (dropdown.querySelector('.dt-custom-sub-btn')?.dataset.btnIdx), 10);
            const btnConfig = (this.config.buttons || [])[btnIdx];

            if (btnConfig && btnConfig.type === 'dropdown') {
                // Триггер блокируется, если абсолютно все значимые дочерние пункты требуют выделения, а строки нет
                const allItemsRequireSelection = (btnConfig.items || []).every(item => item.type === 'divider' || item.requiresSelection);

                if (allItemsRequireSelection) {
                    if (hasSelection) {
                        toggleButton.removeAttribute('disabled');
                        toggleButton.classList.remove('disabled');
                    } else {
                        toggleButton.setAttribute('disabled', 'true');
                        toggleButton.classList.add('disabled');
                    }
                }
            }
        });
    }


    /**
     * Корректный экспорт с учетом чекбоксов и скрытых служебных колонок
     */
    exportToExcel() {
        // 1. Извлекаем заголовки только реальных текстовых th (пропускаем техническую колонку с чекбоксом)
        const thElements = Array.from(this.dom.table.querySelectorAll('thead th'));
        if (this.config.checkboxSelect) thElements.shift();

        const headers = thElements
            .map(th => `<Cell><Data ss:Type="String">${th.textContent.trim()}</Data></Cell>`)
            .join('');

        // 2. Извлекаем строки данных из DOM, пропуская первую ячейку с чекбоксом
        const rows = Array.from(this.dom.table.querySelectorAll('tbody tr'))
            .map(tr => {
                // Проверяем, что это не строка-заглушка "Записи не найдены" или "Ошибка"
                if (!tr.dataset.row) return '';

                const tdElements = Array.from(tr.querySelectorAll('td'));
                if (this.config.checkboxSelect) tdElements.shift(); // Сдвигаем на 1 ячейку вправо, убирая чекбокс

                const cells = tdElements
                    .map(td => {
                        const textValue = td.textContent.trim();
                        return `<Cell><Data ss:Type="String">${textValue}</Data></Cell>`;
                    })
                    .join('');

                return `<Row>${cells}</Row>`;
            })
            .filter(rowStr => rowStr !== '') // Исключаем пустые строки ошибок
            .join('');

        const xmlParts = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<?mso-application progid="Excel.Sheet"?>',
            '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ',
            'xmlns:o="urn:schemas-microsoft-com:office:office" ',
            'xmlns:x="urn:schemas-microsoft-com:office:excel" ',
            'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ',
            'xmlns:html="http://w3.org">',
            '<Worksheet ss:Name="Data"><Table>',
            `<Row>${headers}</Row>`,
            rows,
            '</Table></Worksheet></Workbook>'
        ];

        const template = xmlParts.join('');
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');

        const blob = new Blob([template], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.config.excelPrefix}_${day}${month}${year}-${hours}${mins}${secs}.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Освобождаем память Blob
    }
}


