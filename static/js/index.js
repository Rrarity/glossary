/**
 * Created by murad on 24.03.14.
 */

$(document).ready(function (e) {

    var BASE_URL = "/";

    var GLOBAL_OPTIONS = {
        query: ""
    };

    var terms_data_source = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                url: BASE_URL + "terms/",
                dataType: "json",
                type: "POST"
            },
            parameterMap: function (options, operation) {
                console.log(options, operation);
                if (operation == "read") {
                    var o = {
                        take: options.take,
                        skip: options.skip,
                        query: GLOBAL_OPTIONS.query
                    };
                    GLOBAL_OPTIONS.query = "";
                    return {options: kendo.stringify(o)};
                }
            }
        },
        requestEnd: function (e) {

        },
        pageSize: 15,
        serverPaging: true,
        schema: {
            data: "items",
            total: "total"
        }
    });

    var pager = $("#pager").kendoPager({
        dataSource: terms_data_source,
        messages: {
            display: "Записей в списке: {2}",
            empty: "Нет данных для отображения",
            first: "Первая страница",
            itemsPerPage: "записей на странице",
            last: "Последняя страница",
            next: "Следующая страница",
            of: "из {0}",
            page: "Страница",
            previous: "Предыдущая страница",
            refresh: "Обновить"
        }
    }).data("kendoPager");

    pager.bind("change", function (e) {

    });

    var terms = $("#terms").kendoListView({
        dataSource: terms_data_source,
        template: kendo.template($("#term_template").html())
    }).data("kendoListView");

    //--------------------------------------------------------------------//

    var search_query = $("#search_form input").kendoAutoComplete({
        dataSource: {
//                serverFiltering: true,
            transport: {
                read: {
                    dataType: "json",
                    type: "POST",
                    url: BASE_URL + "search_suggestions/"
                }
//                    parameterMap: function(data, type) {
//                        console.log(data, type);
//                        if (type == "read") {
//                            return {filter: JSON.stringify(data.filter.filters[0].value)}
//                        }
//                    }
            }
        },
        filter: "contains"
//            placeholder: "Поиск",
    }).data("kendoAutoComplete");

    $("#search_form").submit(function(e) {
        GLOBAL_OPTIONS.query = search_query.value();
        terms_data_source.read();
        return false;
    });

});