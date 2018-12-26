(function (namespace, $) {
    "use strict";

    var Demo = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = Demo.prototype;
    var sysversion = "1.0";
    var sysrev = "1";

    // =========================================================================
    // INIT
    // =========================================================================

    p.initialize = function () {
        this._enableEvents();
        this._initButtonStates();
        this._initIconSearch();
        this._initInversedTogglers();
        this._loadMenu();
        this._initChatMessage();
        this._loadUserTable();
        this._initUser();
        this._loadIntervalMsgInterno();
    };

    // =========================================================================
    // EVENTS
    // =========================================================================

    // events
    p._enableEvents = function () {
        var o = this;

        $('.card-head .tools .btn-refresh').on('click', function (e) {
            o._handleCardRefresh(e);
        });
        $('.card-head .tools .btn-collapse').on('click', function (e) {
            o._handleCardCollapse(e);
        });
        $('.card-head .tools .btn-close').on('click', function (e) {
            o._handleCardClose(e);
        });
        $('.card-head .tools .menu-card-styling a').on('click', function (e) {
            o._handleCardStyling(e);
        });
        $('.theme-selector a').on('click', function (e) {
            o._handleThemeSwitch(e);
        });
        $('#cmdlogout').on('click', function (e) {
            p._userLogOut();
        });

        $("#cmdfinduser").keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
            }
            var searchText = $("#cmdfinduser").val().toUpperCase();

            $('#usertable > li').each(function () {

                var currentLiText = $(this).text().toUpperCase(),
                    showCurrentLi = currentLiText.indexOf(searchText) !== -1;

                $(this).toggle(showCurrentLi);

            });
        });
    };

    // =========================================================================
    // CARD ACTIONS
    // =========================================================================

    p._handleCardRefresh = function (e) {
        var o = this;
        var card = $(e.currentTarget).closest('.card');
        materialadmin.AppCard.addCardLoader(card);
        setTimeout(function () {
            materialadmin.AppCard.removeCardLoader(card);
        }, 1500);
    };

    p._handleCardCollapse = function (e) {
        var card = $(e.currentTarget).closest('.card');
        materialadmin.AppCard.toggleCardCollapse(card);
    };

    p._handleCardClose = function (e) {
        var card = $(e.currentTarget).closest('.card');
        materialadmin.AppCard.removeCard(card);
    };

    p._handleCardStyling = function (e) {
        // Get selected style and active card
        var newStyle = $(e.currentTarget).data('style');
        var card = $(e.currentTarget).closest('.card');

        // Display the selected style in the dropdown menu
        $(e.currentTarget).closest('ul').find('li').removeClass('active');
        $(e.currentTarget).closest('li').addClass('active');

        // Find all cards with a 'style-' class
        var styledCard = card.closest('[class*="style-"]');

        if (styledCard.length > 0 && (!styledCard.hasClass('style-white') && !styledCard.hasClass('style-transparent'))) {
            // If a styled card is found, replace the style with the selected style
            // Exclude style-white and style-transparent
            styledCard.attr('class', function (i, c) {
                return c.replace(/\bstyle-\S+/g, newStyle);
            });
        }
        else {
            // Create variable to check if a style is switched
            var styleSwitched = false;

            // When no cards are found with a style, look inside the card for styled headers or body
            card.find('[class*="style-"]').each(function () {
                // Replace the style with the selected style
                // Exclude style-white and style-transparent
                if (!$(this).hasClass('style-white') && !$(this).hasClass('style-transparent')) {
                    $(this).attr('class', function (i, c) {
                        return c.replace(/\bstyle-\S+/g, newStyle);
                    });
                    styleSwitched = true;
                }
            });

            // If no style is switched, add 1 to the main Card
            if (styleSwitched === false) {
                card.addClass(newStyle);
            }
        }
    };

    // =========================================================================
    // COLOR SWITCHER
    // =========================================================================

    p._handleThemeSwitch = function (e) {
        e.preventDefault();
        var newTheme = $(e.currentTarget).attr('href');
        this.switchTheme(newTheme);
    };

    p.switchTheme = function (theme) {
        $('link').each(function () {
            var href = $(this).attr('href');
            href = href.replace(/(assets\/css\/)(.*)(\/)/g, 'assets/css/' + theme + '/');
            $(this).attr('href', href);
        });
    };

    // =========================================================================
    // CHAT MESSAGE
    // =========================================================================

    p._initChatMessage = function (e) {
        var o = this;
        $('#sidebarChatMessage').keydown(function (e) {
            o._handleChatMessage(e);
        });
    };

    p._handleChatMessage = function (e) {
        var input = $(e.currentTarget);

        // Detect enter
        if (e.keyCode === 13) {
            e.preventDefault();

            if (input.val() == "")
                return;

            // Get chat message
            var demoTime = new Date().getHours() + ':' + new Date().getMinutes();
            var demoImage = $('.list-chats li img').attr('src');

            // Create html
            var html = '';
            html += '<li>';
            html += '	<div class="chat">';
            html += '		<div class="chat-avatar">';
            //html += '		    <img class="img-circle" src="assets/img/avatar9.jpg?1404026744" alt="" />';
            html += '		</div>';
            html += '		<div class="chat-body">';
            html += '			' + input.val();
            html += '			<small>' + demoTime + '</small>';
            html += '		</div>';
            html += '	</div>';
            html += '</li>';
            var $new = $(html).hide();

            // Add to chat list
            $('.list-chats').prepend($new);

            // Animate new inserts
            $new.show('fast');

            // Refresh for correct scroller size
            $('.offcanvas').trigger('refresh');

            var reciveruid = $.cookie('reciveruid');

            p._savechatmessage(reciveruid, input.val());

            // Reset chat input
            input.val('').trigger('autosize.resize');


        }
        else if (e.keyCode === 27) {
            //console.log('shit');
            //materialadmin.AppOffcanvas._handleOffcanvasClose();
        }
    };

    p._savechatmessage = function (useridout, msg) {

        if (msg == "")
            return;

        var uid = $.cookie('userid');

        var data = {
            userout: useridout
            , msgtxt: msg
           , uid: uid
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/ChatService.asmx/SaveMessage',
            success: function (json) {
                console.log("message is saved now");
                //var obj = $.parseJSON(json.d);
                //$.each(obj, function (i, item) {
                //    p._AddChatComments(obj[i].msguserid, obj[i].msgtext, obj[i].msgdate);
                //})
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });

    };

    $('#refreshchat').on('click', function () {
        var reciveruid = $.cookie('reciveruid');
        p._loadFullChatMessages(reciveruid);
    });

    $('.modal').on('hide', function (e) {
        e.preventDefault();
    });

    ////

    //$('#msgalert').on('click', function () {
    //    alert('loadmsg');
    //    p._alertNewComments('');
    //});

    var refreshIntervalMessages = null;
    $("body").on("click", "a.tile-content", function (ev) {
        ev.preventDefault();
        materialadmin.AppOffcanvas._handleOffcanvasOpen($(this));
        var name = "Chat con " + $(this).data("name");
        $("#chatHeader").text(name);

        var id = $(this).data("id");

        $.cookie('reciveruid', id);
        p._loadFullChatMessages(id);

        refreshIntervalMessages = setInterval(function () {
            _loadChatMessages(id);
        }, 5000);

    });

    p._clearChatInterval = function () {
        $.cookie('reciveruid', null);
        clearInterval(refreshIntervalMessages);
        refreshIntervalMessages = null;
    };

    p._loadFullChatMessages = function (useridout) {

        if (useridout == null)
            return false;

        var uid = $.cookie('userid');

        $(".list-chats").empty();
        var data = {
            userout: useridout
            , uid: uid
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/ChatService.asmx/GetFullMessages',
            success: function (json) {
                var obj = $.parseJSON(json.d);
                var i = 0;
                $.each(obj, function (index, item) {
                    p._AddChatComments(item.MSGUSERID, item.MSGTEXT, item.MSGDATE, true);
                    i++;
                });

                //$.each(obj, function (i, item) {

                //    p._AddChatComments(obj[i].msguserid, obj[i].msgtext, obj[i].msgdate, true);
                //})
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    };

    function _loadChatMessages(useridout) {

        if (useridout == null)
            return false;

        var uid = $.cookie('userid');

        var data = {
            userout: useridout
            , uid: uid
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/ChatService.asmx/GetLastMessages',
            success: function (json) {
                var obj = $.parseJSON(json.d);
                $.each(obj, function (i, item) {
                    p._AddChatComments(obj[i].msguserid, obj[i].msgtext, obj[i].msgdate, false);
                })
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    };
    p._AddChatComments = function (msguid, msgtext, msgdate, isfull) {

        // Get chat message
        var demoImage = $('.list-chats li img').attr('src');

        var uid = $.cookie('userid');

        // Create html
        var html = '';
        html += '<li class="chat' + (msguid != uid ? "-left" : "") + '">';;
        html += '	<div class="chat">';
        html += '		<div class="chat-avatar">';
        //html += '		    <img class="img-circle" src="assets/img/avatar9.jpg?1404026744" alt="" />';
        html += '		</div>';
        html += '		<div class="chat-body">';
        html += '			' + msgtext;
        html += '			<small>' + msgdate + '</small>';
        html += '		</div>';
        html += '	</div>';
        html += '</li>';
        var $new = $(html).hide();

        // Add to chat list
        if (isfull)
            $('.list-chats').append($new);
        else
            $('.list-chats').prepend($new);

        // Animate new inserts
        $new.show('fast');

        // Refresh for correct scroller size
        $('.offcanvas').trigger('refresh');

    };
    p._addChatComment = function (mine, comment, nowtime) {
        alert("entramos");
        var html = '';
        html += '<li class="chat' + (mine ? "-left" : "") + '">';
        html += '	<div class="chat">';
        html += '		<div class="chat-avatar">';
        //html += '		    <img class="img-circle" src="assets/img/avatar9.jpg?1404026744" alt="" />';
        html += '		</div>';
        html += '		<div class="chat-body">';
        html += '			' + comment
        html += '			<small>' + nowtime + '</small>';
        html += '		</div>';
        html += '	</div>';
        html += '</li>';
        var $new = $(html).hide();
        $('.list-chats').append($new);
    };

    p._loadIntervalMsgInterno = function () {
        refreshIntervalMessages = setInterval(function () {
            p._alertNewComments();
        }, 50000);
    };

    p._alertNewComments = function () {

        if ($("#submsgalert").hasClass("badge style-danger"))
            return;

        var uid = $.cookie('userid');

        var data = {
            uid: uid
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/ChatService.asmx/GetUnReadMessages',
            success: function (json) {
                var obj = $.parseJSON(json.d);

                $("#menumsg").empty();

                var x = 0;
                var html = '';
                html += '<li class="dropdown-header">Mensajes de hoy</li>';
                $.each(obj, function (i, item) {
                    x += obj[i].msgs;
                    html += '<li>';
                    html += '	<a class="alert alert-callout alert-info" data-id=' + obj[i].userid + ' data-name=' + obj[i].uid + ' href="#offcanvas-chat"  data-toggle="offcanvas" data-backdrop="false">';
                    html += '		<strong>' + obj[i].uid + '</strong><br />';
                    html += '		 <small>Le ha enviado ' + obj[i].msgs + ' nuevos mensajes<br /></small>';
                    html += '		 <small>' + obj[i].msgtext + '</small>';
                    html += '	</a>';
                    html += '</li>';
                })

                //html += '<li class="dropdown-header">Opciones</li>';
                //html += '<li><a href="wallnews.aspx">ir al Muro de Noticias<span class="pull-right"><i class="fa fa-arrow-right"></i></span></a></li>';
                $('#menumsg').append($(html));

                if (x > 0) {
                    $('#submsgalert').addClass('badge style-danger');
                    $('#submsgalert').text(x);
                    $("#sound1").trigger('play');
                    document.title = 'Tiene ' + x + ' mensajes nuevos';
                    alert('Tiene ' + x + ' mensajes nuevos');
                }
                else {
                    document.title = 'DASHBOARD';
                }
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    };
    // from Chatzilla

    function notifyAttention(source) {
        if (typeof source != "object")
            source = client.viewsArray[source].source;
        if (client.currentObject != source) {
            var tb = getTabForObject(source, true);
            var vk = Number(tb.getAttribute("viewKey"));
            tb.setAttribute("state", "attention");
            client.activityList[vk] = "!";
            updateTitle();
        }
        if (client.FLASH_WINDOW)
            window.getAttention();
    }

    $("body").on("click", "a.alert", function (ev) {
        ev.preventDefault();
        materialadmin.AppOffcanvas._handleOffcanvasOpen($(this));
        var name = "Chat con " + $(this).data("name");
        $("#chatHeader").text(name);

        var id = $(this).data("id");

        $.cookie('reciveruid', id);
        p._loadFullChatMessages(id);

        refreshIntervalMessages = setInterval(function () {
            _loadChatMessages(id);
        }, 5000);

    });

    p._alertNewCommentsTest = function (data) {
        $("#menumsg").empty();
        var html = '';
        html += '<li class="dropdown-header">Mensajes de hoy</li>';
        html += '<li>';
        html += '	<a class="alert alert-callout alert-info" href="javascript:void(0);">';
        html += '		<strong>Usuario</strong><br />';
        html += '		 <small>Revisando los ultimos cambios</small>';
        html += '	</a>';
        html += '</li>';
        html += '<li class="dropdown-header">Opciones</li>';
        html += '<li><a href="wallnews.aspx">ir al Muro de Noticias<span class="pull-right"><i class="fa fa-arrow-right"></i></span></a></li>';
        $('#menumsg').append($(html));

        $('#submsgalert').addClass('badge style-danger');
        $('#submsgalert').text('10');
    };

    $('#msgalert').on('click', function () {
        $('#submsgalert').removeClass('badge style-danger');
        $('#submsgalert').text('');

        //$('#submsgalert').addClass('badge style-danger');
        //$('#submsgalert').text('10');
    });

    // =========================================================================
    // INVERSE UI TOGGLERS
    // =========================================================================

    p._initInversedTogglers = function () {
        var o = this;


        $('input[name="menubarInversed"]').on('change', function (e) {
            o._handleMenubarInversed(e);
        });
        $('input[name="headerInversed"]').on('change', function (e) {
            o._handleHeaderInversed(e);
        });
    };

    p._handleMenubarInversed = function (e) {
        if ($(e.currentTarget).val() === '1') {
            $('#menubar').addClass('menubar-inverse');
        }
        else {
            $('#menubar').removeClass('menubar-inverse');
        }
    };
    p._handleHeaderInversed = function (e) {
        if ($(e.currentTarget).val() === '1') {
            $('#header').addClass('header-inverse');
        }
        else {
            $('#header').removeClass('header-inverse');
        }
    };

    // =========================================================================
    // BUTTON STATES (LOADING)
    // =========================================================================

    p._initButtonStates = function () {
        $('.btn-loading-state').click(function () {
            var btn = $(this);
            btn.button('loading');
            setTimeout(function () {
                btn.button('reset');
            }, 3000);
        });
    };

    // =========================================================================
    // ICON SEARCH
    // =========================================================================

    p._initIconSearch = function () {
        if ($('#iconsearch').length === 0) {
            return;
        }

        $('#iconsearch').focus();
        $('#iconsearch').on('keyup', function () {
            var val = $('#iconsearch').val();
            $('.col-md-3').hide();
            $('.col-md-3:contains("' + val + '")').each(function (e) {
                $(this).show();
            });

            $('.card').hide();
            $('.card:contains("' + val + '")').each(function (e) {
                $(this).show();
            });
        });
    };


    // =========================================================================
    // USER LIST
    // =========================================================================

    p._loadUserTable = function () {

        //var usrlist1 = $.cookie('boarduserlist');
        //if (usrlist1 != null) {
        //    var usrlist = $.parseJSON(usrlist1.d);
        //    $.each(usrlist, function (i, item) {
        //        if (userfirstletter != usrlist[i].usernm.charAt(0).toUpperCase()) {
        //            userfirstletter = usrlist[i].usernm.charAt(0).toUpperCase();
        //            p._addUserSeparator(userfirstletter);
        //        }
        //        p._addUser(usrlist[i].userid, usrlist[i].usernm, usrlist[i].username, usrlist[i].userregion, usrlist[i].userphone)
        //    });
        //    return false;
        //}

        $.ajax({
            type: 'POST',
            data: JSON.stringify({}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/common.asmx/loadusertable',
            success: function (data) {
                var obj = $.parseJSON(data.d);
                var userfirstletter;
                $.cookie('boarduserlist', JSON.stringify(obj));
                $.each(obj, function (i, item) {
                    if (userfirstletter != obj[i].userfname.charAt(0).toUpperCase()) {
                        userfirstletter = obj[i].userfname.charAt(0).toUpperCase();
                        p._addUserSeparator(userfirstletter);
                    }
                    p._addUser(obj[i].userid, obj[i].userfname, obj[i].userlname, "", obj[i].userphone, obj[i].userext)
                });
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    };
    p._initUser = function () {
        var userfname = $.cookie('userfname');
        var userlname = $.cookie('userlname');
        var uprofiledesc = "Administracion";
        var ulevel = 0;

        var uprofile = 0;

        var usuinfo = userfname + " " + userlname + "<small>" + uprofiledesc + "</small>";

        $("#profile-info").html(usuinfo);

        $("#main-menu li").each(function () {
            var liText = $(this).data('profile');
            var level = $(this).data('level');
            var liciaText = $(this).data('cia');           


            if (liText < uprofile) {
                $(this).hide();                
            }
            else {
                $(this).show();
                if (level != undefined) {
                    if (level < ulevel)
                        $(this).hide();
                    else
                        $(this).show();
                }
            }
            if (liText == 4) {
                if (uprofile == "4" || uprofile == "2" || uprofile == "1" || uprofile == "0")
                    $(this).show();
                else
                    $(this).hide();  
            }


            if (level == 0) {
                if (ulevel == "0") {
                    $(this).show();
                }
            }
            //console.log('uprofile ' + uprofile);
            //console.log('liText ' + liText);
            //console.log('liciaText ' + liciaText);
            //console.log('ciaid ' + ciaid);

            if (uprofile > 3) {
                if (liciaText != undefined) {
                    if (ciaid != liciaText) {
                        $(this).hide();
                    }
                }
            }

        });

        var pagedh = location.pathname.substring(1);
        var res = pagedh.substring(0, 4);

        // alert(res);

        //if (uprofile > 2 && pagedh.indexOf("dashboardjqx.aspx") > 1) { window.location = "dashboarduser.aspx"; }


    };
    p._userLogOut = function () {

        window.location = "login.aspx";

    };
    p._addUserSeparator = function (charSeparator) {
        var html = '';
        html += '<li class="tile divider-full-bleed">';
        html += '	<div class="tile-content">';
        html += '		<div class="tile-text">';
        html += '			<small>' + charSeparator + '</small>';
        html += '		</div>';
        html += '	</div>';
        html += '</li>';
        var $new = $(html);
        $('.list').append($new);
    };
    p._addUser = function (id, username, useremail, userregion, userphone) {
        var html = '';
        html += '<li class="tile">';
        html += '	<a class="tile-content ink-reaction" data-id=' + id + ' data-name=' + username + ' href="#offcanvas-chat"  data-toggle="offcanvas" data-backdrop="false">';
        html += '		<div class="tile-icon">';
        html += '		    <img src="assets/img/avatar4.jpg?1404026791" alt="" />';
        //html += '		    <sup class="badge style-danger">Off Line</sup></div>';
        html += '		</div>';
        html += '		<div class="tile-text">';
        html += '			' + username
        html += '			<small>' + userregion + '</small>';
        html += '			<small>' + useremail + '</small>';
        html += '			<small>' + userphone + '</small>';
        html += '		</div>';
        html += '	</a>';
        html += '</li>';
        var $new = $(html);
        $('.list').append($new);
    };


    // =========================================================================
    // MAIN MENU
    // =========================================================================
    p._loadMenu = function () {
        var sPref = $.cookie('sPref');

        var html = '';
        //DASHBOARD
        html += '<li class="gui-folder" data-option="dashboard"  data-profile="6">';
        html += '	<a id="lidash" href="#" data-toggle="tooltip" data-placement="rigth" title="" data-original-title="Pantalla Inicial">';
        html += '		<div class="gui-icon"><i class="md md-home"></i></div>';
        html += '		     <span class="title">Dashboard</span>';
        html += '		</div>';
        html += '	</a>';
        html += '		<ul>';
        html += '		     <li><a href="dashboard.aspx"><span class="title">General</span></a></li>';
        html += '		     <li><a href="dashimpo.html"><span class="title">Importaciones</span></a></li>';
        html += '		     <li><a href="dashexpo.html"><span class="title">Exportaciones</span></a></li>';
        html += '		     <li><a href="dashbod.html"><span class="title">Bodega</span></a></li>';
        html += '		</ul>';
        html += '</li>';
        $('#main-menu').append($(html).hide());

        //CORPORATE
        html = "";
        html += '<li class="gui-folder" data-option="corporate"  data-profile="8">';
        html += '	<a id="licorp" href="#">';
        html += '		<div class="gui-icon"><i class="md md-language"></i></div>';
        html += '		     <span class="title">Corporativo</span>';
        html += '	</a>';
        html += '		<ul>';
        html += '		     <li><a href="wallnews.aspx"><span class="title">Muro de noticias</span></a></li>';
        html += '		     <li><a href="frmboletin.aspx"><span class="title">Boletin Mensual</span></a></li>';
        html += '		        <li class="gui-folder">';
        html += '		                <a href="javascript:void(0);">';
        html += '		                    <span class="title">Multimedia</span>';
        html += '		                </a>';
        html += '		                <ul>';
        html += '		                    <li data-option="videoticketsoporte"><a href="herramientasdigitales.aspx?src=5"><span class="title">Como abrir tickets de soporte</span></a></li>';
        html += '		                </ul>';
        html += '		            </li>';
        html += '		     <li><a href="ftosoficiales.aspx"><span class="title">Formatos Oficiales</span></a></li>';
        html += '		</ul>';
        html += '</li>';
        $('#main-menu').append($(html).hide());

        //REPORTS
        html = "";
        html += '<li data-option="reportes" class="gui-folder"  data-profile="8">';
        html += '	<a id="lirep" href="#">';
        html += '		<div class="gui-icon"><i class="fa fa-file-excel-o fa-fw"></i></div>';
        html += '		     <span class="title">Reportes Operacion</span>';
        html += '	</a>';
        html += '		<ul>';
        html += '		     <li class="gui-folder">';
        html += '		        <a href="javascript:void(0);">';
        html += '		            <span class="title">Trafico</span>';
        html += '		        </a>';
        html += '		        <ul>';
        html += '		                    <li data-option="repbodegaS" ><a href="repbodega.aspx"><span class="title">Mercancia en Bodega</span></a></li>';
        html += '		                    <li data-option="repcrucesxfacS"><a href="repcrucesxfac.aspx"><span class="title">Cruzados Por Factura</span></a></li>';
        html += '		                    <li data-option="repcrucesxpartidaS"><a href="repcrucesxpartida.aspx"><span class="title">Cruzados Por Partida</span></a></li>';
        html += '		                    <li data-option="repcrucesopS" ><a href="repcrucesop.aspx"><span class="title">Reporte de Operaciones</span></a></li>';
        html += '		                    <li data-option="repcrucesopxremS" ><a href="repcrucesopxrem.aspx"><span class="title">Reporte de Remesas</span></a></li>';
        html += '		        </ul>';
        html += '		     </li>';
        html += '		     <li class="gui-folder">';
        html += '		        <a href="javascript:void(0);">';
        html += '		            <span class="title">Pedimentos</span>';
        html += '		        </a>';
        html += '		        <ul>';
        html += '		             <li data-option="reppedimentogral" ><a href="reppedimentogral.aspx"><span class="title">General</span></a></li>';
        html += '		             <li data-option="reppedpagdes" ><a href="reppedpagdes.aspx"><span class="title">Pagados/Desaduanados</span></a></li>';
        html += '		             <li data-option="reprojosr1" ><a href="reprojosr1.aspx"><span class="title">Reporte de R1</span></a></li>';
        html += '		             <li data-option="repsolimpuestosim" ><a href="repsolimpuestosim.aspx"><span class="title">Detalle de Impuestos</span></a></li>';
        html += '		        </ul>';
        html += '		     </li>';
        html += '		</ul>';
        html += '</li>';
        $('#main-menu').append($(html).hide());


        //TOOLS
        html = "";
        html += '<li data-option="tools" class="gui-folder"  data-profile="8">';
        html += '	<a id="litool" href="#">';
        html += '		<div class="gui-icon"><i class="fa fa-puzzle-piece fa-fw"></i></div>';
        html += '		     <span class="title">Herramientas</span>';
        html += '	</a>';
        html += '		<ul>';
        html += '		     <li><a href="http://www.siicex-caaarem.org.mx/" target="_blank"><span class="title">Busqueda por Fraccion</span></a></li>';
        html += '		     <li><a href="https://aplicacionesc.mat.sat.gob.mx/SOIANET/oia_consultarap_cep.aspx"><span class="title">Consulta SOIA</span></a></li>';
        html += '		</ul>';
        html += '</li>';
        $('#main-menu').append($(html).hide());

        ////TRACKING
        //html = "";
        //html += '<li data-option="admin" class="gui-folder"  data-profile="8">';
        //html += '	<a id="liadmin" href="#">';
        //html += '		<div class="gui-icon"><i class="md md-track-changes"></i></div>';
        //html += '		     <span class="title">Tracking</span>';
        //html += '	</a>';
        //html += '		<ul>';
        //html += '		     <li><a href="frmtracking.aspx"><span class="title">Actualizacion de estatus</span></a></li>';
        //html += '		</ul>';
        //html += '</li>';
        //$('#main-menu').append($(html).hide());

        ////REPORTES ESPECIALES
        //html = "";
        //html += '<li data-option="admin" class="gui-folder" data-profile="4">';
        //html += '	<a id="liadmin" href="#">';
        //html += '		<div class="gui-icon"><i class="md md-assignment-late"></i></div>';
        //html += '		     <span class="title">Reportes Especiales</span>';
        //html += '	</a>';
        //html += '		<ul>';
        //html += '		     <li><a href="repgerencial.aspx"><span class="title">Reporte Gerencial de Operaciones</span></a></li>';
        //html += '		</ul>';
        //html += '</li>';
        //$('#main-menu').append($(html).hide());

        ////ADMINISTRATION
        html = "";
        html += '<li data-option="admin" class="gui-folder" data-profile="5">';
        html += '	<a id="liadmin" href="#">';
        html += '		<div class="gui-icon"><i class="md md-lock-open"></i></div>';
        html += '		     <span class="title">Administracion</span>';
        html += '	</a>';
        html += '		<ul>';
        html += '            <li data-option="repopgastos"><a href="repopgastos.aspx"><span class="title">Control de gastos</span></a></li>';
        html += '		</ul>';
        html += '</li>';
        $('#main-menu').append($(html).hide());

        ////SETTINGS
        //html = "";
        //html += '<li data-option="settings" class="gui-folder" data-level="0" data-profile="2">';
        //html += '	<a id="liadmin" href="#">';
        //html += '		<div class="gui-icon"><i class="md md-settings"></i></div>';
        //html += '		     <span class="title">Sistema</span>';
        //html += '	</a>';
        //html += '		<ul>';
        //html += '		     <li><a href="adminusers.aspx"><span class="title">Administracion de usuarios</span></a></li>';
        //html += '		</ul>';
        //html += '</li>';
        //$('#main-menu').append($(html).hide());

        //SYSTEM INFO
        var GAAccountId = 'AFS FORWARDING LLC';
        html = "";
        html += '<small class="no-linebreak hidden-folded">';
        html += '	<span class="opacity-75">Copyright &copy; 2019</span> <strong>' + GAAccountId + '</strong><br />';
        html += '	<span class="opacity-75">Dashboard Version ' + sysversion + '</span><br />';
        html += '	<span class="opacity-75">No. Revision ' + sysrev + '</span><br />';
        html += '	<span class="opacity-75"><a href="mailto:leonel.gonzalez@afsforwarding.com">Comentarios al administrador</a></span>';
        html += '</small>';
        $('#txtcia').append(html);

    };

    p._validateUser = function () {
        var html = "";
        html += '<div class="modal fade" id="formSession" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">';
        html += '<div class="modal-dialog">';
        html += '	<div class="modal-content">';
        html += '		<div class="modal-header">';
        html += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
        html += '			<h4 class="modal-title" id="formModalLabel">Su session ha expidado</h4>';
        html += '		</div>';
        html += '		<form class="form-horizontal" role="form">';
        html += '			<div class="modal-body">';
        html += '				<div class="form-group">';
        html += '					<div class="col-sm-3">';
        html += '						<label for="email1" class="control-label">Usuario</label>';
        html += '					</div>';
        html += '					<div class="col-sm-9">';
        html += '						<input type="email" name="email1" id="email1" class="form-control" placeholder="Email">';
        html += '					</div>';
        html += '				</div>';
        html += '				<div class="form-group">';
        html += '					<div class="col-sm-3">';
        html += '						<label for="password1" class="control-label">Password</label>';
        html += '					</div>';
        html += '					<div class="col-sm-9">';
        html += '						<input type="password" name="password1" id="password1" class="form-control" placeholder="Password">';
        html += '					</div>';
        html += '				</div>';
        html += '				<div class="form-group">';
        html += '					<div class="col-sm-3">';
        html += '					</div>';
        html += '					<div class="col-sm-9">';
        html += '						<div class="checkbox">';
        html += '							<label>';
        html += '								<input type="checkbox" id="cb1"> Remember me';
        html += '							</label>';
        html += '						</div>';
        html += '					</div>';
        html += '				</div>';
        html += '			</div>';
        html += '			<div class="modal-footer">';
        html += '				<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
        html += '				<button type="button" class="btn btn-primary">Login</button>';
        html += '			</div>';
        html += '		</form>';
        html += '	</div>';
        html += '</div><!';
        html += '</div>';
        // $('#sessionvalidator').append(html);
    };
    // =========================================================================
    namespace.Demo = new Demo;
}(this.materialadmin, jQuery)); // pass in (namespace, jQuery):


//(function (i, s, o, g, r, a, m) {
//    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
//        (i[r].q = i[r].q || []).push(arguments)
//    }, i[r].l = 1 * new Date(); a = s.createElement(o),
//    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
//})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

//ga('create', 'UA-65330728-1', 'auto');
//ga('send', 'pageview');

