<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="repanexo19.aspx.cs" Inherits="afsweb.repanexo19" %>
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
                        <li>Reportes</li>
                        <li class="active">Pedimentos</li>
                    </ol>
                </div>
                <div class="section-body">

                    <!-- BEGIN DATATABLE 2 -->
                    <div class="row">
                        <div class="col-md-12">
                            <h4>Reporte Anexo 24</h4>
                        </div>
                        <!--end .col -->
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <!--end .card-body -->
                            <!--end .card -->
                            <div class="table-responsive">
                                <%--<div id="jqxWidgetDatePicker">Seleccione rango de fechas -</div>--%>
                                <div id="jqxgrid">
                                </div>
                                <%--<div id="loading" style="position: absolute; top: 0; left: 0;">
                                    <img src="assets/js/libs/jqwidgets/styles/images/loader.gif" /><span>Loading</span>
                                </div>--%>
                                <div class="alert alert-warning" role="alert">
                                    <i class="fa fa-lightbulb-o"></i><strong> Informacion:</strong> Este reporte le va a mostrar el <strong> detalle de los pedimentos </strong>que esten dentro del rango proporcionado (fecha de pago), del tipo de operacion proporcionado  y de las Aduanas asignadas a su perfil.  
                                    <br> <i class="fa fa-exclamation-triangle"></i><strong> Atención:</strong> Detalle de los datos generales de Pedimento (Aduanet).
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
        <!--end #content-->
        <!-- END CONTENT -->
        <div id='Menu'>
            <ul>
                <li>Abrir expediente digital</li>
            </ul>
        </div>
        <!-- BEGIN MENUBAR-->
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

    <input id="fecf" value="<%= Session["fechafin"] %>" hidden />
    <input id="feci" value="<%= Session["fechaini"] %>" hidden />

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
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxcore.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxdata.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxbuttons.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxscrollbar.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxmenu.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxlistbox.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxdropdownlist.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxgrid.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxgrid.selection.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxgrid.columnsresize.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxgrid.filter.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxgrid.sort.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxgrid.pager.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxgrid.grouping.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxgrid.aggregates.js"></script>
    <script src="assets/js/libs/jqwidgets/jqxgrid.export.js" type="text/javascript"></script>
    <script src="assets/js/libs/jqwidgets/jqxdata.export.js" type="text/javascript"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxdatetimeinput.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxcalendar.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxtooltip.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/globalization/globalize.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxcombobox.js"></script>
    <script src="assets/js/libs/jcookie/jquery.cookie.js"></script>
    <script src="assets/js/core/demo/Demo.js"></script>
    <script src="assets/js/core/demo/DemoFormComponents.js"></script>
    <script src="assets/js/core/demo/repanexo24.js"></script>
    <!-- END JAVASCRIPT -->

</body>
</html>


