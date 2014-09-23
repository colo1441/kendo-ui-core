(function() {
    module("TreeList API", {
        setup: function() {
           dom = $("<div />").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);

            dom = instance = null;
        }
    });

    function createTreeList(options) {
        dom.kendoTreeList($.extend({
            dataSource: [
                { id: 1, parentId: null },
                { id: 2, parentId: 1 }
            ],
            columns: [ "id", "parentId" ]
        }, options));

        instance = dom.data("kendoTreeList");
    }

    test("dataItem returns item by table row", function() {
        createTreeList();

        var dataItem = instance.dataItem(instance.content.find("tr:first"));

        equal(dataItem, instance.dataSource.get(1));
    });

    test("dataItem returns item by nested element", function() {
        createTreeList();

        var dataItem = instance.dataItem(instance.content.find(".k-icon:first"));

        equal(dataItem, instance.dataSource.get(1));
    });

    test("dataItem returns item for nested tr", function() {
        createTreeList({
            dataSource: [
                { id: 1, expanded: true, parentId: null },
                { id: 2, parentId: 1 }
            ]
        });

        var dataItem = instance.dataItem(instance.content.find("tr:last"));

        equal(dataItem, instance.dataSource.get(2));
    });

    test("destroy unbinds dataSource handlers", function() {
        createTreeList();

        var dataSource = instance.dataSource;

        instance.destroy();

        function hasHandlers(eventName) {
            var handlers = dataSource._events[eventName];
            return handlers && handlers.length;
        }

        ok(!hasHandlers("change"), "change handlers remaining");
        ok(!hasHandlers("error"), "error handlers remaining");
        ok(!hasHandlers("progress"), "progress handlers remaining");
    });

    test("destroy nulls dom references", function() {
        createTreeList();

        instance.destroy();

        ok(!instance.element);
        ok(!instance.header);
        ok(!instance.content);
        ok(!instance.headerTree);
        ok(!instance.contentTree);
    });

    test("destroy removes event handlers", function() {
        createTreeList();

        var content = instance.content;

        instance.destroy();

        var events = $._data(content[0], "events");
        ok(!events || !events.click || !events.click.length);
    });
})()
