/* Version 0.1.1 testingasndsan */
com_redbassett_mod_hide = {
    options: {
        groupsAllow: proboards.plugin.get("mod_hide_action").settings.groupsAllow,
        showStubs: proboards.plugin.get("mod_hide_action").settings.showStubs
    },
    run: function () {
        if (this.inArray(proboards.data("route").name, ["thread", "all_recent_posts", "recent_posts"])) {
            var e = $("tr.post");
            e.each(function () {
                var e = $(this).attr("id").replace("post-", "");
                $(this).bind("hidePost", function () {
                    var e = $(this).attr("id").replace("post-", "");
                    $(this).addClass("hiddenPost");
                    if (com_redbassett_mod_hide.userCanHide()) {
                        var t = $("<li>").addClass(e + "-hidePost").append($("<a>").append($("<span>").addClass("icon")).text("Show Post"));
                        t.click(function () {
                            $(this).trigger("showPost")
                        });
                        $(this).find("li.moderate").children("ul").prepend(t);
                        proboards.plugin.key("hidden").set(e, 2, {
                            success: function () {
                                console.log("Post " + e + " hidden.")
                            },
                            fail: function () {
                                console.log("Post " + e + " failed to hide: " + error.code + ": " + error.reason)
                            }
                        })
                    } else {
                        if (com_redbassett_mod_hide.options.showStubs == 1) {
                            $(this).addClass("hiddenPostStub");
                            var n = $("<div>").addClass("hiddenPostMessage").text("Post Hidden");
                            $(this).children("td").append(n)
                        } else {
                            $(this).hide()
                        }
                    }
                }).bind("showPost", function () {
                    $(this).show();
                    var e = $(this).attr("id").replace("post-", "");
                    $(this).removeClass("hiddenPost").removeClass("hiddenPostStub").find("div.hiddenPostMessage").remove();
                    if (com_redbassett_mod_hide.userCanHide()) {
                        var t = $("<li>").addClass(e + "-hidePost").append($("<a>").append($("<span>").addClass("icon")).text("Hide Post"));
                        t.click(function () {
                            $(this).trigger("hidePost")
                        });
                        $(this).find("li.moderate").children("ul").prepend(t);
                        proboards.plugin.key("hidden").set(e, 1, {
                            success: function () {
                                console.log("Post " + e + " shown.")
                            },
                            fail: function () {
                                console.log("Post " + e + " failed to show: " + error.code + ": " + error.reason)
                            }
                        })
                    }
                });
                if (proboards.plugin.key("hidden").get(e) == 2) {
                    $(this).trigger("hidePost")
                } else {
                    $(this).trigger("showPost")
                }
            })
        }
    },
    hidePost: function (e) {},
    showPost: function (e) {},
    userCanHide: function () {
        var e = false;
        var t = proboards.data("user").group_ids || [];
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            if (this.inArray(r, this.options.groupsAllow)) {
                e = true;
                break
            }
        }
        return e
    },
    inArray: function (e, t) {
        var n = false;
        for (var r = 0; r < t.length; r++) {
            if (e == t[r]) {
                n = true;
                break
            }
        }
        return n
    }
};
$(document).ready(function () {
    com_redbassett_mod_hide.run()
})