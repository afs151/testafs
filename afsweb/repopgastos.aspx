<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="repopgastos.aspx.cs" Inherits="afsweb.repopgastos" %>

<!-- Ulñtima version -->
<!DOCTYPE html>
<html lang="en">
<head>
    <title><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Reportes</title>
    <link rel="shortcut icon" href="assets/img/favicon.ico">

    <!-- BEGIN META -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="your,keywords">
    <meta name="description" content="Short explanation about this website">
    <!-- END META -->

    <!-- BEGIN STYLESHEETS -->
    <link href='http://fonts.googleapis.com/css?family=Roboto:300italic,400italic,300,400,500,700,900' rel='stylesheet' type='text/css' />
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/bootstrap.css?1422792965" />
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/materialadmin.css?1425466319" />
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/font-awesome.min.css?1422529194" />
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/material-design-iconic-font.min.css?1421434286" />
    <link rel="stylesheet" href="assets/js/libs/jqwidgets/styles/jqx.base.css" type="text/css" />
    <link rel="stylesheet" href="assets/js/libs/jqwidgets/styles/jqx.bootstrap.css" type="text/css" />
    <!-- END STYLESHEETS -->

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
		<script type="text/javascript" src="assets/js/libs/utils/html5shiv.js?1403934957"></script>
		<script type="text/javascript" src="assets/js/libs/utils/respond.min.js?1403934956"></script>
		<![endif]-->
</head>
<body class="menubar-hoverable header-fixed ">
    <style>
        .jqx-notification-container {
            z-index: 1000;
        }

        #navcontainer ul {
            margin: 0;
            padding: 0;
            list-style-type: none;
            text-align: center;
        }

            #navcontainer ul li {
                display: inline;
            }

                #navcontainer ul li a {
                    text-decoration: none;
                    padding: .2em 1em;
                }

                    #navcontainer ul li a:hover {
                        color: #fff;
                        background-color: #369;
                    }

        .aqua {
            background-color: aqua;
        }

        .yellow {
            background-color: yellow;
        }

        .brown {
            background-color: sandybrown;
        }

        .gray {
            background-color: lightslategray;
        }

        .red {
            background-color: red;
        }

        .red-light {
            background-color: #ff3333;
        }

        .green-light {
            background-color: #85e085;
        }

        .yellow-light {
            background-color: #ffff66;
        }
    </style>
    <audio src="sounds/tada.wav" id="sound1"></audio>

    <!-- BEGIN HEADER-->
    <header id="header">
        <div class="headerbar">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="headerbar-left">
                <ul class="header-nav header-nav-options">
                    <li class="header-nav-brand">
                        <div class="brand-holder">
                            <a href="#">
                                <span class="text-lg text-bold text-primary"><%=ConfigurationManager.AppSettings["CIA.NAME"]%></span>
                            </a>
                        </div>
                    </li>
                    <li>
                        <a class="btn btn-icon-toggle menubar-toggle" data-toggle="menubar" href="javascript:void(0);">
                            <i class="fa fa-bars"></i>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="headerbar-right">
                <ul class="header-nav header-nav-options">
                    <%--                    <li>
                        <!-- Search form -->
                        <form class="navbar-search" role="search">
                            <div class="form-group">
                                <input type="text" class="form-control" name="headerSearch" placeholder="Enter your keyword">
                            </div>
                            <button type="submit" class="btn btn-icon-toggle ink-reaction"><i class="fa fa-search"></i></button>
                        </form>
                    </li>--%>
                    <li class="dropdown hidden-xs">
                        <a href="javascript:void(0);" class="btn btn-icon-toggle btn-default" data-toggle="dropdown" id="msgalert">
                            <i class="fa fa-bell"></i><sup id="submsgalert" class=""></sup>
                        </a>
                        <ul id="menumsg" class="dropdown-menu animation-expand">
                        </ul>
                        <!--end .dropdown-menu -->
                    </li>
                    <!--end .dropdown -->
                </ul>
                <!--end .header-nav-options -->
                <ul class="header-nav header-nav-profile">
                    <li class="dropdown">
                        <a href="javascript:void(0);" class="dropdown-toggle ink-reaction" data-toggle="dropdown">
                            <img src="assets/img/avatar1.jpg?1403934956" alt="" />
                            <span id="profile-info" class="profile-info">Usuario
									<small>Administrator</small>
                            </span>
                        </a>
                        <ul class="dropdown-menu animation-dock">
                            <li class="dropdown-header">Config</li>
                            <li><a href="#">My profile</a></li>
                            <li class="divider"></li>
                            <li><a href="locked.aspx"><i class="fa fa-fw fa-lock"></i>Lock</a></li>
                            <li><a href="login.aspx"><i class="fa fa-fw fa-power-off text-danger"></i>Logout</a></li>
                        </ul>
                        <!--end .dropdown-menu -->
                    </li>
                    <!--end .dropdown -->
                </ul>
                <!--end .header-nav-profile -->
                <ul class="header-nav header-nav-toggle">
                    <li>
                        <a id="btnSearch" class="btn btn-icon-toggle btn-default" href="#offcanvas-search" data-toggle="offcanvas" data-backdrop="false">
                            <i class="md md-textsms"></i>
                        </a>
                    </li>
                </ul>
                <!--end .header-nav-toggle -->
            </div>
            <!--end #header-navbar-collapse -->
        </div>
    </header>
    <!-- END HEADER-->

    <!-- BEGIN BASE-->
    <div id="base">

        <!-- BEGIN OFFCANVAS LEFT -->
        <div class="offcanvas">
        </div>
        <!--end .offcanvas-->
        <!-- END OFFCANVAS LEFT -->

        <!-- BEGIN CONTENT-->
        <div id="content">
            <section class="style-default-bright">
                <div class="section-header">
                    <ol class="breadcrumb">
                        <li>Administracion</li>
                        <li class="active">Control de Gastos</li>
                    </ol>
                </div>
                <div class="section-body">

                    <!-- BEGIN DATATABLE 2 -->
                    <div class="row">
                        <div class="col-lg-12">
                            <!--end .card-body -->
                            <!--end .card -->
                            <div class="table-responsive">
                                <div id="jqxgrid">
                                </div>
                            </div>
                            <!--end .table-responsive -->
                        </div>
                        <!--end .col -->
                    </div>
                    <!--end .row -->
                    <!-- END DATATABLE 2 -->

                </div>
                <!--end .section-body -->
            </section>
        </div>
        <div id="menubar" class="menubar-inverse ">
            <div class="menubar-fixed-panel">
                <div>
                    <a class="btn btn-icon-toggle btn-default menubar-toggle" data-toggle="menubar" href="javascript:void(0);">
                        <i class="fa fa-bars"></i>
                    </a>
                </div>
                <div class="expanded">
                    <a href="dashboardjqx.aspx">
                        <span class="text-lg text-bold text-primary "><%=ConfigurationManager.AppSettings["CIA.NAME"]%></span>
                    </a>
                </div>
            </div>
            <div class="menubar-scroll-panel">
                <!-- BEGIN MAIN MENU -->
                <ul id="main-menu" class="gui-controls">
                </ul>
                <div id="txtcia" class="menubar-foot-panel">
                </div>
            </div>
            <!--end .menubar-scroll-panel-->
        </div>
        <!--end #menubar-->
        <!-- END MENUBAR -->

        <!-- BEGIN OFFCANVAS RIGHT -->
        <div class="offcanvas">

            <!-- BEGIN OFFCANVAS SEARCH -->
            <div id="offcanvas-search" class="offcanvas-pane width-8">
                <div class="offcanvas-head">
                    <header class="text-primary">Search</header>
                    <div class="offcanvas-tools">
                        <a class="btn btn-icon-toggle btn-default-light pull-right" data-dismiss="offcanvas">
                            <i class="md md-close"></i>
                        </a>
                    </div>
                </div>
                <form class="navbar-search" role="search">
                    <div class="form-group">
                        <input id="cmdfinduser" type="text" class="form-control" name="headerSearch" placeholder="Enter your keyword">
                    </div>
                    <button type="submit" class="btn btn-icon-toggle ink-reaction"><i class="fa fa-search"></i></button>
                </form>
                <div class="offcanvas-body no-padding">
                    <ul id="usertable" class="list">
                    </ul>
                </div>
                <!--end .offcanvas-body -->
            </div>
            <!--end .offcanvas-pane -->
            <!-- END OFFCANVAS SEARCH -->

            <!-- BEGIN OFFCANVAS CHAT -->
            <div id="offcanvas-chat" class="offcanvas-pane style-default-light width-12">
                <div class="offcanvas-head style-default-bright">
                    <header class="text-primary"><span id="chatHeader">CHAT</span></header>
                    <div class="offcanvas-tools">
                        <a id="btnToggle" class="btn btn-icon-toggle btn-default-light pull-right" data-dismiss="offcanvas">
                            <i class="md md-close"></i>
                        </a>
                        <a id="btnToggleContinue" class="btn btn-icon-toggle btn-default-light pull-right" href="#offcanvas-search" data-toggle="offcanvas" data-backdrop="false">
                            <i class="md md-arrow-back"></i>
                        </a>
                        <a id="refreshchat" class="btn btn-icon-toggle btn-refresh btn-default-light pull-right"><i class="md md-refresh"></i></a>
                    </div>
                    <form class="form">
                        <div class="form-group floating-label">
                            <textarea name="sidebarChatMessage" id="sidebarChatMessage" class="form-control autosize" rows="1"></textarea>
                            <label for="sidebarChatMessage">Deja tu mensaje</label>
                        </div>
                    </form>
                </div>
                <div class="offcanvas-body">
                    <ul class="list-chats">
                    </ul>
                </div>
                <!--end .offcanvas-body -->
            </div>
            <!--end .offcanvas-pane -->
            <!-- END OFFCANVAS CHAT -->
        </div>
        <!--end .offcanvas-->
        <!-- END OFFCANVAS RIGHT -->

    </div>
    <!--end #base-->
    <!-- END BASE -->
    <div style="visibility: hidden;">
        <div id='Menu'>
            <ul>
                <li>Capturar gasto</li>
                <li>Ver detalle de gastos Local</li>
                <li>Ver detalle de gastos GlobalPC</li>
                <li>Asingar Relacion de Gastos</li>
                <li>Imprimir Relacion de Gastos</li>
            </ul>
        </div>
    </div>
    <div style="visibility: hidden;">
        <div id='MenuGastos'>
            <ul>
                <li>Editar gasto</li>
                <li>Eliminar gasto</li>
            </ul>
        </div>
    </div>
    <input id="fecf" value="<%= Session["fechafin"] %>" hidden />
    <input id="feci" value="<%= Session["fechaini"] %>" hidden />

    <div class="modal fade" id="formgastos" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="txtgastos">Captura de gastos de trafico <span id="txtgastosspan"></span>   TIPO - <span id="txtgastostipospan"></span></h4>
                </div>
                <div class="form-horizontal" role="form">
                    <div class="modal-body">
                        <div class="form-group">
                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-11">
                                    <label class="radio-styled">
                                        <input type="radio" name="inlineRadioOptions" value="1" checked><span>Gasto Mexicano</span>
                                    </label>
                                    <label class="radio-styled">
                                        <input type="radio" name="inlineRadioOptions" value="2"><span>Gasto Americano</span>
                                    </label>
                                </div>
                                <!--end .col -->
                            </div>
                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-11">
                                    <select id="txtgastosref" class="form-control">
                                    </select>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-11">
                                    <div class="form-group floating-label">
                                        <div class="input-group">
                                            <span class="input-group-addon"><i class="fa fa-usd fa-lg"></i></span>
                                            <div class="input-group-content">
                                                <input type="text" class="form-control" id="dollars10" value="0.00">
                                            </div>
                                            <span class="input-group-addon">.00</span>
                                        </div>
                                    </div>
                                    <!--end .form-group -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                        <button id="cmdcapturagastos" type="button" class="btn btn-primary">Aceptar</button>
                    </div>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="formgastosglobal" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="txtgastosglobal">Detalle de gastos de trafico - <span id="txtgastosglobalspan"></span>   TIPO - <span id="txtgastosglobaltipospan"></span></h4>
                </div>
                <div class="form-horizontal" role="form">
                    <div class="modal-body">
                        <div class="form-group">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="table-responsive">
                                        <div id="jqxgridgastosglobal">
                                        </div>
                                    </div>
                                </div>
                                <!--end .col -->
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Aceptar</button>
                    </div>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <div class="modal fade" id="formgastoslocal" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="txtgastoslocal">Detalle de gastos de trafico <span id="txtgastoslocalspan"></span>TIPO - <span id="txtgastoslocaltipospan"></span></h4>
                </div>
                <div class="form-horizontal" role="form">
                    <div class="modal-body">
                        <div class="form-group">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="table-responsive">
                                        <div id="jqxgridgastoslocal">
                                        </div>
                                    </div>
                                </div>
                                <!--end .col -->
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Aceptar</button>
                    </div>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- BEGIN JAVASCRIPT -->
    <script src="assets/js/libs/jquery/jquery-1.11.2.min.js"></script>
    <script src="assets/js/libs/jquery/jquery-migrate-1.2.1.min.js"></script>
    <script src="assets/js/libs/bootstrap/bootstrap.min.js"></script>
    <script src="assets/js/libs/spin.js/spin.min.js"></script>
    <script src="assets/js/libs/autosize/jquery.autosize.min.js"></script>
    <script src="assets/js/libs/nanoscroller/jquery.nanoscroller.min.js"></script>
    <script src="assets/js/core/source/App.js"></script>
    <script src="assets/js/core/source/AppNavigation.js"></script>
    <script src="assets/js/core/source/AppOffcanvas.js"></script>
    <script src="assets/js/core/source/AppCard.js"></script>
    <script src="assets/js/core/source/AppForm.js"></script>
    <script src="assets/js/core/source/AppNavSearch.js"></script>
    <script src="assets/js/core/source/AppVendor.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqx-all.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/globalization/globalize.js"></script>
    <script src="assets/js/libs/bootbox/bootbox.min.js"></script>
    <script src="assets/js/libs/jcookie/jquery.cookie.js"></script>
    <script src="assets/js/core/demo/Demo.js"></script>
    <script src="assets/js/core/demo/DemoFormComponents.js"></script>
    <script src="assets/js/core/demo/repopgastos.js"></script>
    <!-- END JAVASCRIPT -->

</body>
</html>


