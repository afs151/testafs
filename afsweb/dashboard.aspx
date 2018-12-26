<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="dashboard.aspx.cs" Inherits="afsweb.dashboard" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Dashboard</title>
    <link rel="shortcut icon" href="assets/img/favicon.ico">

    <!-- BEGIN META -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="your,keywords">
    <meta name="description" content="Short explanation about this website">
    <!-- END META -->

    <!-- BEGIN STYLESHEETS -->
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/bootstrap.css?1422792965" />
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/materialadmin.css?1425466319" />
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/font-awesome.min.css?1422529194" />
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/material-design-iconic-font.min.css?1421434286" />
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/libs/rickshaw/rickshaw.css?1422792967" />
    <link type="text/css" rel="stylesheet" href="assets/css/theme-3/libs/morris/morris.core.css?1420463396" />
    <link rel="stylesheet" href="assets/js/libs/jqwidgets/styles/jqx.base.css" type="text/css" />
    <link rel="stylesheet" href="assets/js/libs/jqwidgets/styles/jqx.bootstrap.css" type="text/css" />
    <link href="assets/js/libs/dropzone/dropzone-theme.css" rel="stylesheet" />


    <!-- END STYLESHEETS -->

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
		<script type="text/javascript" src="assets/js/libs/utils/html5shiv.js?1403934957"></script>
		<script type="text/javascript" src="assets/js/libs/utils/respond.min.js?1403934956"></script>
		<![endif]-->
</head>
<body class="menubar-hoverable header-fixed ">
    echo
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
    </style>
    <!--Notifications-->
    <div id="messageNotification">
        <div>
            <div>Bienvenido:<span id="notificationuser" style="font-weight: bold;"></span></div>
        </div>
    </div>
    <div id="timeNotification">
        <div><span id="currentTime" style="font-weight: bold;"></span>.</div>
    </div>
    <div id="successNotification">
        <div><span id="successmsg"></span></div>
    </div>
    <div id="errorNotification">
        <div><span id="errormsg"></span></div>
    </div>
    <div id="warningNotification">
        <div><span id="warningmsg"></span></div>
    </div>
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
                                <span class="text-lg text-bold text-primary"><%=ConfigurationManager.AppSettings["CIA.NAME"]%> </span>
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
                    <li class="dropdown hidden-xs">
                        <a href="javascript:void(0);" class="btn btn-icon-toggle btn-default" data-toggle="dropdown" id="msgalert">
                            <i class="fa fa-bell" data-toggle="tooltip" data-placement="left" title="" data-original-title="Nuevos mensajes"></i><sup id="submsgalert" class=""></sup>
                        </a>
                        <ul id="menumsg" class="dropdown-menu animation-expand">
                        </ul>
                        <!--end .dropdown-menu -->
                    </li>
                    <!--end .dropdown -->
                </ul>
                <ul class="header-nav header-nav-options">
                    <li class="dropdown hidden-xs">
                        <a href="javascript:void(0);" class="btn btn-icon-toggle btn-default" data-toggle="dropdown" id="A1">
                            <i class="md md-people" data-toggle="tooltip" data-placement="left" title="" data-original-title="Acerca de"></i><sup id="Sup1" class=""></sup>
                        </a>
                        <ul class="dropdown-menu animation-dock">
                            <li class="dropdown-header">Acerca de</li>
                            <li><a href="#"><%=ConfigurationManager.AppSettings["CIA.NAME"]%> </a></li>
                            <li class="divider"></li>
                            <li><a href="#" data-toggle="modal" data-target="#formcomments"><i class="md md-send"></i>&nbsp;&nbsp;&nbsp;Envia tus comentarios</a></li>
                            <li><a href="#" data-toggle="modal" data-target="#formerrors"><i class="md md-bug-report"></i>&nbsp;&nbsp;&nbsp;<%=ConfigurationManager.AppSettings["CIA.NAME"]%>  HelpDesk</a></li>
                            <li><a href="#" data-toggle="modal" data-target="#"><i class="md md-file-upload"></i>&nbsp;&nbsp;&nbsp;Historial de actualizaciones</a></li>
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
                            <li><a href="#" id="cmdlogout"><i class="fa fa-fw fa-power-off text-danger"></i>Logout</a></li>
                        </ul>
                        <!--end .dropdown-menu -->
                    </li>
                    <!--end .dropdown -->
                </ul>
                <!--end .header-nav-profile -->
                <ul class="header-nav header-nav-toggle">
                    <li>
                        <a id="btnSearch" class="btn btn-icon-toggle btn-default" href="#offcanvas-search" data-toggle="offcanvas" data-backdrop="false">
                            <i class="md md-textsms" data-toggle="tooltip" data-placement="left" title="" data-original-title="Chat interno"></i>
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
        <!-- BEGIN CONTENT-->
        <div id="content">
            <section>
                <div class="section-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card card-underline">
                                <div class="card-head">
                                    <ul class="nav nav-tabs pull-right" data-toggle="tabs">
                                        <li class="active"><a id="tabimpo" href="#primero">CARGA COMPLETA</a></li>
                                        <li><a id="tabdirectos" href="#sexto">CAMION DIRECTO</a></li>
                                        <li><a id="tabexpo" href="#segundo">EXPORTACION</a></li>
                                        <li><a id="tabconso" href="#tercero">CONSOLIDADOS</a></li>
                                        <li><a id="tabfur" href="#cuarto">FURGONES</a></li>
                                        <li><a id="tabadel" href="#quinto">ADELANTADOS</a></li>
                                    </ul>
                                    <header><span id="progcruces" style="font-weight: bold;"></span></header>
                                </div>
                                <div class="card-body tab-content">
                                    <div class="tab-pane active" id="primero">
                                        <div id="jqxgrid">
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="segundo">
                                        <div id="jqxgridexp">
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="cuarto">
                                        <div id="jqxgridfur">
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="tercero">
                                        <div id="jqxgridconso">
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="quinto">
                                        <div id="jqxgridadel">
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="sexto">
                                        <div id="jqxgriddirectos">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-1"></div>
                                    <div class="col-md-10">
                                        <div class="btn-group btn-group-justified" role="group" aria-label="Justified button group">
                                            <a class="btn btn-default-ligth" role="button">En Proceso</a>
                                            <a class="btn btn-default-dark" role="button">Pagado</a>
                                            <a class="btn gray" role="button">Cargado</a>
                                            <a class="btn yellow" role="button">Salio de patio</a>
                                            <a class="btn btn-success" role="button">Cruze Verde</a>
                                            <a class="btn btn-danger" role="button">Cruze Rojo</a>
                                            <a class="btn btn-warning" role="button">Cruce Rojo Gama</a>
                                        </div>
                                    </div>
                                    <div class="col-md-1"></div>
                                </div>

                                <!--end .btn-group -->
                            </div>
                            <!--end .card -->
                        </div>
                        <!--end .col -->
                    </div>
                    <%--<div class="row">
                        <!-- BEGIN SITE ACTIVITY -->
                        <div class="col-md-9">
                            <div class="card ">
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="card-head">
                                            <header>Cruces por aduana Laredo</header>
                                            <div class="tools">
                                                <a id="soia_refresh" class="btn btn-icon-toggle btn-refresh"><i class="md md-refresh"></i></a>
                                                <a class="btn btn-icon-toggle btn-collapse"><i class="fa fa-angle-down"></i></a>
                                                <a class="btn btn-icon-toggle btn-close"><i class="md md-close"></i></a>
                                            </div>
                                        </div>
                                        <!--end .card-head -->
                                        <div class="card-body height-8">
                                            <div id="flot-visitors-legend" class="flot-legend-horizontal stick-top-right no-y-padding"></div>
                                            <div id="crucesxsemana"></div>
                                        </div>
                                        <!--end .card-body -->
                                    </div>
                                    <!--end .col -->
                                    <div class="col-md-4">
                                        <div class="card-head">
                                            <header>Estado SOIA diario</header>
                                        </div>
                                        <div class="card-body height-10">
                                            <strong>
                                                <span id="lblsoiapago">-</span></strong>&nbsp;&nbsp;PAGO ELECTRONICO
												<span class="pull-right text-success text-sm"><i class="md"></i></span>
                                            <div class="progress progress-hairline">
                                                <div class="progress-bar progress-bar-primary-dark" style="width: 100%"></div>
                                            </div>
                                            <strong>
                                                <span id="lblsoiarojo">-</span></strong>&nbsp;&nbsp;ROJO EN SELECCION ADUANERA
												<span class="pull-right text-danger text-sm"><i class="md"></i></span>
                                            <div class="progress progress-hairline">
                                                <div class="progress-bar progress-bar-danger" style="width: 100%"></div>

                                            </div>
                                            <strong>
                                                <span id="lblsoiaverde">-</span></strong>&nbsp;&nbsp;VERDE EN SELECCION ADUANERA
												<span class="pull-right text-success text-sm"><i class="md"></i></span>
                                            <div class="progress progress-hairline">
                                                <div class="progress-bar progress-bar-success" style="width: 100%"></div>
                                            </div>
                                            <strong>
                                                <span id="lblsoiainc">-</span></strong>&nbsp;&nbsp;RESULTADO CON INCIDENCIAS
												<span class="pull-right text-danger text-sm"><i class="md"></i></span>
                                            <div class="progress progress-hairline">
                                                <div class="progress-bar progress-bar-primary-danger" style="width: 0%"></div>
                                            </div>
                                            <strong>
                                                <span id="lblsoiades">-</span></strong>&nbsp;&nbsp;DESADUANADO
												<span class="pull-right text-success text-sm"><i class="md"></i></span>
                                            <div class="progress progress-hairline">
                                                <div class="progress-bar progress-bar-primary-dark" style="width: 100%"></div>
                                            </div>
                                            <a href="repcruces.aspx" class="title">Ver detalle</a>
                                        </div>
                                        <!--end .card-body -->
                                    </div>
                                    <!--end .col -->
                                </div>
                                <!--end .row -->
                            </div>
                            <!--end .card -->
                        </div>
                        <!--end .col -->
                        <!-- END SITE ACTIVITY -->

                        <!-- BEGIN SERVER STATUS -->

                        <!--end .col -->
                        <!-- END SERVER STATUS -->
                    </div>--%>
                </div>
            </section>
        </div>
        <!--end #content-->
        <!-- BEGIN MENUBAR-->
        <div style="visibility: hidden;">
            <div id='menuimpo'>
                <ul>
                    <li>Capturar ITN</li>
                    <li>Capturar Doda</li>
                    <li>Ver/Capturar historial de trafico</li>
                    <li>Capturar observaciones</li>
                    <li>Capturar EJ Pedimento</li>
                    <li>Capturar EJ Trafico</li>
                    <li>Asignar Transfer</li>
                    <li>Asignar Hora Estimada</li>
                    <li>Capturar estatus pedimento</li>
                    <li>Capturar estatus bodega</li>
                    <li>Capturar estatus aduana</li>
                    <li>Consolidar</li>
                    <li>Subir Documentos o fotos de trafico</li>
                    <li>Desprogramar trafico</li>
                </ul>
            </div>
            <div id='menuexpo'>
                <ul style="overflow: hidden;">
                    <li>Capturar Doda</li>
                    <li>Ver/Capturar historial de trafico</li>
                    <li>Capturar observaciones</li>
                    <li>Capturar EJ Pedimento</li>
                    <li>Capturar EJ Trafico</li>
                    <li>Asignar Transfer</li>
                    <li>Asignar Hora Estimada</li>
                    <li>Capturar estatus pedimento</li>
                    <li>Capturar estatus bodega</li>
                    <li>Capturar estatus aduana</li>
                    <li>Consolidar</li>
                    <li>Subir Documentos o fotos de trafico</li>
                    <li>Desprogramar trafico</li>
                </ul>
            </div>
            <div id='menuconso'>
                <ul>
                    <li>Capturar ITN</li>
                    <li>Capturar Doda</li>
                    <li>Ver/Capturar historial de trafico</li>
                    <li>Capturar observaciones</li>
                    <li>Capturar EJ Pedimento</li>
                    <li>Capturar EJ Trafico</li>
                    <li>Asignar Transfer</li>
                    <li>Asignar Hora Estimada</li>
                    <li>Capturar estatus pedimento</li>
                    <li>Capturar estatus bodega</li>
                    <li>Capturar estatus aduana</li>
                    <li>Consolidar</li>
                    <li>Subir Documentos o fotos de trafico</li>
                    <li>Desprogramar trafico</li>
                </ul>
            </div>
            <div id='menufur'>
                <ul>
                    <li>Capturar ITN</li>
                    <li>Capturar Doda</li>
                    <li>Ver/Capturar historial de trafico</li>
                    <li>Capturar observaciones</li>
                    <li>Capturar EJ Pedimento</li>
                    <li>Capturar EJ Trafico</li>
                    <li>Asignar Transfer</li>
                    <li>Asignar Hora Estimada</li>
                    <li>Capturar estatus pedimento</li>
                    <li>Capturar estatus bodega</li>
                    <li>Capturar estatus aduana</li>
                    <li>Consolidar</li>
                    <li>Subir Documentos o fotos de trafico</li>
                    <li>Desprogramar trafico</li>
                </ul>
            </div>
            <div id='menudir'>
                <ul>
                    <li>Capturar ITN</li>
                    <li>Capturar Doda</li>
                    <li>Ver/Capturar historial de trafico</li>
                    <li>Capturar observaciones</li>
                    <li>Capturar EJ Pedimento</li>
                    <li>Capturar EJ Trafico</li>
                    <li>Asignar Transfer</li>
                    <li>Asignar Hora Estimada</li>
                    <li>Capturar estatus pedimento</li>
                    <li>Capturar estatus bodega</li>
                    <li>Capturar estatus aduana</li>
                    <li>Consolidar</li>
                    <li>Subir Documentos o fotos de trafico</li>
                    <li>Desprogramar trafico</li>
                </ul>
            </div>
            <div id='menuadel'>
                <ul>
                    <li>Capturar ITN</li>
                    <li>Capturar Doda</li>
                    <li>Ver/Capturar historial de trafico</li>
                    <li>Capturar observaciones</li>
                    <li>Capturar EJ Pedimento</li>
                    <li>Capturar EJ Trafico</li>
                    <li>Asignar Transfer</li>
                    <li>Asignar Hora Estimada</li>
                    <li>Capturar estatus pedimento</li>
                    <li>Capturar estatus bodega</li>
                    <li>Capturar estatus aduana</li>
                    <li>Consolidar</li>
                    <li>Subir Documentos o fotos de trafico</li>
                    <li>Desprogramar trafico</li>
                </ul>
            </div>
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
                        <span class="text-lg text-bold text-primary "><%=ConfigurationManager.AppSettings["CIA.NAME"]%> </span>
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
        <!-- BEGIN OFFCANVAS RIGHT -->
        <div class="offcanvas">
            <!-- BEGIN OFFCANVAS SEARCH -->
            <div id="offcanvas-search" class="offcanvas-pane width-8">
                <div class="offcanvas-head">
                    <header class="text-primary"></header>
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
        <!-- BEGIN FORM MODAL MARKUP -->
        <div class="modal fade" id="formstatus" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtstatus">Captura estatus pedimento de trafico <span id="txtstatusspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <select id="txtstatusref" class="form-control">
                                        <option value="0"></option>
                                        <option value="1">DOC DIG</option>
                                        <option value="2">CAM REQ</option>
                                        <option value="3">PROF LISTA</option>
                                        <option value="4">COVE LISTO</option>
                                        <option value="5">PAGO AUT</option>
                                        <option value="6">VALIDANDO</option>
                                        <option value="7">PAGADO</option>
                                        <option value="8">CANCELADO</option>
                                        <option value="9">REV DOC</option>
                                        <option value="10">PENDIENTE</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturastatus" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formejecutivo" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtejecutivo">Captura EJ de Trafico <span id="txtejecutivospan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <select id="txtejecutivoref" class="form-control">
                                        <option value="0"></option>
                                        <option value="1">ARMANDO</option>
                                        <option value="2">BENITO</option>
                                        <option value="3">CLAUDIA</option>
                                        <option value="4">CRISTIAN</option>
                                        <option value="5">DANIELA</option>
                                        <option value="6">DAVID</option>
                                        <option value="7">EDITH</option>
                                        <option value="8">ELENA</option>
                                        <option value="9">ESMERALDA</option>
                                        <option value="10">GIANCARLO</option>
                                        <option value="11">JANETH</option>
                                        <option value="12">KARLA</option>
                                        <option value="13">LETTY</option>
                                        <option value="14">LINDA</option>
                                        <option value="15">LUIS</option>
                                        <option value="16">MARISSA</option>
                                        <option value="17">NORMA</option>
                                        <option value="18">OMAR</option>
                                        <option value="19">ROSARIO</option>
                                        <option value="20">SANDRA</option>
                                        <option value="21">SINA</option>
                                        <option value="22">SOFIA</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturaejecutivo" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formelaboro" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtelaboro">Captura EJ de Pedimento <span id="txtelaborospan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <select id="txtelabororef" class="form-control">
                                        <option value="0"></option>
                                        <option value="1">ALFONSO</option>
                                        <option value="2">ANGELICA</option>
                                        <option value="3">ERICA</option>
                                        <option value="4">ESMERALDA</option>
                                        <option value="5">LUIS</option>
                                        <option value="6">MARIO</option>
                                        <option value="7">RAUL</option>
                                        <option value="8">SANDRA</option>
                                        <option value="9">SARAI</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturaelaboro" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formestatusbod" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtestatusbod">Captura estatus bodega de trafico <span id="txtestatusbodspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <select id="txtestatusbodref" class="form-control">
                                        <option value="0"></option>
                                        <option value="1">PENDIENTE ORDEN DE CARGA</option>
                                        <option value="2">ORDEN ENTREGADA</option>
                                        <option value="3">EN PROCESO</option>
                                        <option value="4">CARGADA</option>
                                        <option value="5">DIRECTA</option>
                                        <option value="6">CANCELADA</option>
                                        <option value="7">CON DETALLE</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturaestatusbod" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formestatusaduana" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtestatusaduana">Captura estatus en bodega de trafico <span id="txtestatusaduanaspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <select id="txtestatusaduanaref" class="form-control">
                                        <option value="0"></option>
                                        <option value="1">PEDIMENTO PAGADO</option>
                                        <option value="2">SALIO DE PATIO</option>
                                        <option value="3">CRUZE VERDE</option>
                                        <option value="4">CRUZE ROJO</option>
                                        <option value="5">CRUZE ROJO GAMA</option>
                                        <option value="6">DESADUANADO</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturaestatusaduana" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formitn" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtadelanta">Captura ITN de trafico <span id="txtadelantaspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <input type="text" name="txtitnref" id="txtitnref" class="form-control" placeholder="ITN">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturaitn" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formdoda" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtdoda">Captura DODA de trafico <span id="txtdodaspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <input type="text" name="txtitnref" id="txtdodaref" class="form-control" placeholder="DODA">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturadoda" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formhora" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txthora">Captura hora estimada de cruce de trafico: <span id="txthoraspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <input type="text" name="txtitnref" id="txthoraref" class="form-control" placeholder="hora">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturahora" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formtransfer" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txttransfer">Captura transfer de trafico: <span id="txttransferspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <select id="txttransferref" class="form-control">
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturatransfer" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formbs" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtrefobs">Captura observaciones de trafico <span id="txtrefobsspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <textarea name="txtobsrefs" id="txtobsrefs" class="form-control" rows="3" required></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturaobs" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formhist" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtrefhist">Historial de trafico <span id="txtrefhistspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="tab-pane pre-scrollable" id="activity">
                                        <ul class="timeline collapse-lg timeline-hairline">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="form-group">
                                <div class="col-sm-10">
                                    <textarea name="txthistrefs" id="txthistrefs" class="form-control" rows="2" required></textarea>
                                </div>
                                <div class="col-sm-2">
                                    <br />
                                    <button type="button" class="btn ink-reaction btn-floating-action btn-primary" id="cmdguardahist"><i class="fa fa-send"></i></button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formreset" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="H1">Programar de trafico</h4>
                    </div>
                    <div class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-8">
                                        <input type="text" name="txtreferencia" id="txtreferencia" class="form-control" placeholder="Referencia">
                                    </div>
                                    <div class="col-sm-2">
                                        <button class="btn btn-icon-toggle ink-reaction" id="cmdbuscaref"><i class="fa fa-search"></i></button>
                                    </div>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-10">
                                        <input type="text" name="txtcliente" id="txtcliente" class="form-control" placeholder="Cliente">
                                    </div>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-10">
                                        <label for="cbogrupotr">EQUIPO</label>
                                        <select id="cbovechiculo" class="form-control">
                                            <option value="0">CAJA</option>
                                            <option value="1">PLATAFORMA</option>
                                            <option value="2">SMLB</option>
                                            <option value="3">CAMIONETA</option>
                                            <option value="4">3.5 TON</option>
                                            <option value="5">RABON</option>
                                        </select>
                                    </div>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-11">
                                        <label class="radio-styled">
                                            <input type="radio" name="inlineRadioOptions" value="1" checked><span>Carga Completa</span>
                                        </label>
                                        <label class="radio-styled">
                                            <input type="radio" name="inlineRadioOptions" value="6"><span>Camion Directo</span>
                                        </label>
                                        <label class="radio-styled">
                                            <input type="radio" name="inlineRadioOptions" value="2"><span>Exportacion</span>
                                        </label>
                                        <label class="radio-styled">
                                            <input type="radio" name="inlineRadioOptions" value="3"><span>Consolidado</span>
                                        </label>
                                        <label class="radio-styled">
                                            <input type="radio" name="inlineRadioOptions" value="4"><span>Furgones</span>
                                        </label>
                                        <label class="radio-styled">
                                            <input type="radio" name="inlineRadioOptions" value="5"><span>Adelantados</span>
                                        </label>
                                    </div>
                                    <!--end .col -->

                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-10">
                                        <label for="cbogrupotr">GRUPO DE TRABAJO</label>
                                        <select id="cbogrupotr" class="form-control">
                                            <option value="0">TODOS</option>
                                            <option value="1">EQUIPO 1</option>
                                            <option value="2">EQUIPO 2</option>
                                            <option value="3">EQUIPO 3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="btnprograma" type="button" class="btn btn-primary">Programar</button>
                        </div>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formbuscaentrada" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="hentrada">Programar Remesa</h4>
                    </div>
                    <div class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-3">
                                        <label>Consecutivo Remesa</label>
                                    </div>
                                    <div class="col-sm-2">
                                        <input type="number" name="txtconsremesa" id="txtconsremesa" class="form-control" value="1">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-8">
                                        <input type="text" name="txtentrada" id="txtentrada" class="form-control" placeholder="Entrada/Referencia">
                                    </div>
                                    <div class="col-sm-2">
                                        <button class="btn btn-icon-toggle ink-reaction" id="cmdbuscaentrada"><i class="fa fa-search"></i></button>
                                    </div>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-10">
                                        <input type="text" name="txtclienteentrada" id="txtclienteentrada" class="form-control" placeholder="Cliente">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="btnprogramaentrada" type="button" class="btn btn-primary">Programar</button>
                        </div>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formconsolidado" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="txtconsolida">Consolidar trafico <span id="txtconsolidaspan"></span></h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-4">
                                    <label class="form-control" id="txtconsco"></label>
                                </div>
                                <div class="col-sm-8">
                                    <input type="text" name="txtconsref" id="txtconsref" class="form-control" placeholder="ASIGNE CLAVE DE CONSOLIDADO">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="cmdcapturaconsolidado" type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formcomments" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="H2">Tus comentarios son importantes para nosotros</h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="textarea1">Envianos tus comentarios</label>
                                <textarea name="textarea1" id="textarea1" class="form-control" rows="3" required></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="btnenviarcomments" type="button" class="btn btn-primary">Enviar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formerrors" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="H3">Asignacion de ticket de reporte</h4>
                    </div>
                    <form class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="textarea1">Favor de envianos una descripcion breve del problema</label>
                                <textarea name="textarea2" id="textarea2" class="form-control" rows="3" required></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="btnsenderror" type="button" class="btn btn-primary">Enviar</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="modal fade" id="formfileupload" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">SUBIR FOTOGRAFIAS DE REFERENCIA: <span id="txtrefuploadspan"></span></h4>
                    </div>
                    <div class="form-horizontal" role="form">
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <select id="selectTipo" name="selectTipo" class="form-control">
                                        <option value="0">FOTO DE ENTRADA</option>
                                        <option value="1">FOTO DE CARGA</option>
                                        <option value="3">FOTO DE SALIDA</option>
                                    </select>
                                </div>
                            </div>
                            <hr class="ruler-xl" />
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-content">
                                        <form id="mydropzone" class="dropzone" action="#" method="post" runat="server" enctype="multipart/form-data">
                                            <div class="dz-default dz-message"><span>Arrastre los archivos a subir o de click en esta seccion</span></div>
                                            <div class="fallback" hidden>
                                                <input id="filessent" name="fil" type="file" multiple />
                                            </div>
                                            <div id="dz-preview">
                                                <div>
                                                    <div><span id="data-dz-name"></span></div>
                                                    <div><span id="data-dz-size"></span></div>
                                                </div>
                                                <div><span id="data-dz-uploadprogress"></span></div>
                                                <div><span id="data-dz-errormessage"></span></div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button id="btnuploadfile" type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
                        </div>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div id="sessionvalidator"></div>
        <asp:Label runat="server" ID="lblnombre"></asp:Label>
    </div>
    <!--end #base-->
    <!-- BEGIN JAVASCRIPT -->
    <script src="assets/js/libs/jquery/jquery-1.11.2.min.js"></script>
    <script src="assets/js/libs/jquery/jquery-migrate-1.2.1.min.js"></script>
    <script src="assets/js/libs/bootstrap/bootstrap.min.js"></script>
    <script src="assets/js/libs/autosize/jquery.autosize.min.js"></script>
    <script src="assets/js/libs/moment/moment.min.js"></script>
    <script src="assets/js/libs/flot/jquery.flot.min.js"></script>
    <script src="assets/js/libs/flot/jquery.flot.time.min.js"></script>
    <script src="assets/js/libs/flot/jquery.flot.resize.min.js"></script>
    <script src="assets/js/libs/flot/jquery.flot.orderBars.js"></script>
    <script src="assets/js/libs/flot/jquery.flot.pie.js"></script>
    <script src="assets/js/libs/flot/curvedLines.js"></script>
    <script src="assets/js/libs/raphael/raphael-min.js"></script>
    <script src="assets/js/libs/morris.js/morris.min.js"></script>
    <script src="assets/js/libs/jquery-knob/jquery.knob.min.js"></script>
    <script src="assets/js/libs/sparkline/jquery.sparkline.min.js"></script>
    <script src="assets/js/libs/nanoscroller/jquery.nanoscroller.min.js"></script>
    <script src="assets/js/libs/d3/d3.min.js"></script>
    <script src="assets/js/libs/d3/d3.v3.js"></script>
    <script src="assets/js/libs/rickshaw/rickshaw.min.js"></script>
    <script src="assets/js/libs/jcookie/jquery.cookie.js"></script>
    <script src="assets/js/core/source/App.js"></script>
    <script src="assets/js/core/source/AppNavigation.js"></script>
    <script src="assets/js/core/source/AppOffcanvas.js"></script>
    <script src="assets/js/core/source/AppCard.js"></script>
    <script src="assets/js/core/source/AppForm.js"></script>
    <script src="assets/js/core/source/AppNavSearch.js"></script>
    <script src="assets/js/core/source/AppVendor.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqx-all.js"></script>
    <script src="assets/js/libs/bootbox/bootbox.min.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqxnotification.js"></script>
    <script src="assets/js/libs/jqwidgets/jqxdata.export.js" type="text/javascript"></script>
    <script src="assets/js/libs/dropzone/dropzone.min.js"></script>
    <script src="assets/js/core/demo/Demo.js"></script>
    <script src="assets/js/core/demo/dashboard.js"></script>
    <!-- END JAVASCRIPT -->
</body>
</html>

