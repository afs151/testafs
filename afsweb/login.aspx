<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="afsweb.login" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Login</title>
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
    <div id="jqxLoader">
    </div>
    <div id="messageNotification">
        <div><span id="notificationuser" style="font-weight: bold;"></span></div>
    </div>
    <div id="errorNotification">
        <div><span id="errormsg" style="font-weight: bold;"></span></div>
    </div>
    <!-- BEGIN LOGIN SECTION -->
    <section class="section-account">
        <div class="img-backdrop" style="background-image: url('assets/img/img16.jpg')"></div>
        <div class="spacer"></div>
        <div class="card contain-sm style-transparent">
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-6">
                        <br />
                        <div class="form floating-label">
                            <div class="form-group">
                                <input type="text" class="form-control" id="username" name="username">
                                <label for="username">Username</label>
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" id="password" name="password">
                                <label for="password">Password</label>
                                <p class="help-block"><a href="#" data-toggle="modal" data-target="#formreset">Forgotten?</a></p>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-xs-6 text-left">
                                    <div class="checkbox checkbox-inline checkbox-styled">
                                        <label>
                                            <input type="checkbox" id="ckrem">
                                            <span>Remember me</span>
                                        </label>
                                    </div>
                                </div>
                                <!--end .col -->
                                <div class="col-xs-6 text-right">
                                    <button class="btn btn-primary btn-raised" id="cmdlogin" name="cmdlogin">Login</button>
                                </div>
                                <!--end .col -->
                            </div>
                            <!--end .row -->
                        </div>
                    </div>
                    <!--end .col -->
                    <div class="col-sm-5 col-sm-offset-1 text-center">
                        <br>
                        <br>
                        <h3 class="text-light">Aun no tienes cuenta?
                        </h3>
                        <button id="btnnuevo" class="btn btn-raised btn-primary" data-toggle="modal" data-target="#formModal">Solicita tu acceso</button>
                        <br>
                        <br>
                        <button id="btnclientaccess" class="btn btn-raised btn-primary">Acceso a clientes</button>
                        <br>
                    </div>
                </div>
            </div>
            <!--end .card-body -->
        </div>
        <!--end .card -->
    </section>
    <!-- END LOGIN SECTION -->


    <!-- BEGIN FORM MODAL MARKUP -->
    <div class="modal fade" id="formModal" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="formModalLabel">Solicitud de registro</h4>
                </div>
                <form class="form form-validate floating-label" novalidate="novalidate">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="Firstname1" required data-rule-minlength="2">
                                        <label for="Firstname1">Nombre</label>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="Lastname1" required data-rule-minlength="2">
                                        <label for="Lastname1">Apellido</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <input type="email" class="form-control" id="Email1" name="Email1" required>
                                <label for="Email1">Email</label>
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" id="Password1" name="Password1" required data-rule-minlength="6">
                                <label for="Password1">Password</label>
                            </div>
                            <div class="form-group">
                                <select id="cia1" name="select1" class="form-control static dirty" required>
                                    <%--<option value="T3035240"><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Nuevo Laredo, Laredo Tx.</option>
                                    <option value="T3035840"><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Intermolda</option>
                                    <option value="T3035270"><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Piedras Negras</option>
                                    <option value="M3035840"><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Virtuales/Especiales</option>
                                    <option value="A3035842"><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Aereo</option>
                                    <option value="A3035840"><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Corresponsalias</option>--%>
                                </select>
                                <label for="select1">Selecciona tu sucursal</label>
                            </div>
                            <div class="form-group">
                                <textarea name="textarea1" id="textarea1" class="form-control" rows="3" required></textarea>
                                <label for="textarea1">Comentarios</label>
                            </div>
                        </div>
                        <!--end .card-body -->
                        <div class="card-actionbar">
                            <div class="card-actionbar-row">
                                <button id="btnsolicita" type="button" class="btn btn-flat btn-primary ink-reaction">Enviar Solicitud</button>
                            </div>
                        </div>

                        <!--end .card-actionbar -->
                    </div>
                    <em class="text-caption">&nbsp;&nbsp;<%=ConfigurationManager.AppSettings["CIA.NAME"]%></em>
                    <!--end .card -->
                </form>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
    <!-- END FORM MODAL MARKUP -->
    <!-- BEGIN FORM MODAL MARKUP -->
    <div class="modal fade" id="formreset" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="H1">Favor de proporcionar los sig datos</h4>
                </div>
                <form class="form-horizontal" role="form" novalidate="novalidate">
                    <div class="modal-body">
                        <div class="form-group">
                            <div class="col-sm-3">
                                <label for="txtusuario" class="control-label">Nombre</label>
                            </div>
                            <div class="col-sm-9">
                                <input type="text" name="txtusuario" id="txtusuario" class="form-control" placeholder="Usuario" required data-rule-minlength="6">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                        <button id="btnreset" type="button" class="btn btn-primary">Enviar Solicitud</button>
                    </div>
                </form>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
    <!-- END FORM MODAL MARKUP -->
    <div class="modal fade" id="formModalnewsol" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">SOLICITUD DE REGISTRO A NUEVOS CLIENTES</h4>
                </div>
                <form class="form form-validate floating-label" novalidate="novalidate">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="solnombre" required data-rule-minlength="2">
                                        <label for="solnombre">NOMBRE</label>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="solapellido" required data-rule-minlength="2">
                                        <label for="solapellido">APELLIDO</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <input type="email" class="form-control" id="solemail" name="solemail" required>
                                <label for="solemail">EMAIL</label>
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" id="solcompnombre" name="solrfc" required data-rule-minlength="6">
                                <label for="solcompnombre">RAZON SOCIAL DE SU EMPRESA</label>
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" id="solcomprfc" name="solrfc" required data-rule-minlength="6">
                                <label for="solcomprfc">RFC DE SU EMPRESA</label>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="solcomptel" name="solcomptel" required data-rule-minlength="6" data-inputmask="'mask': '+99(999)999-9999'">
                                        <label for="solcomptel">TELEFONO</label>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="solcompext" name="solcompext">
                                        <label for="solcompext">EXTENCION</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <textarea name="solobs" id="solobs" class="form-control" rows="3"></textarea>
                                <label for="solobs">COMENTARIOS ADICIONALES</label>
                            </div>
                        </div>
                        <!--end .card-body -->
                        <div class="card-actionbar">
                            <div class="card-actionbar-row">
                                <button id="btnsolicitanewcte" type="button" class="btn btn-flat btn-primary ink-reaction">ENVIAR SOLICITUD</button>
                            </div>
                        </div>

                        <!--end .card-actionbar -->
                    </div>
                    <em class="text-caption">&nbsp;&nbsp;<%=ConfigurationManager.AppSettings["CIA.NAME"]%></em>
                    <!--end .card -->
                </form>
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
    <script src="assets/js/libs/jcookie/jquery.cookie.js"></script>
    <script src="assets/js/libs/jquery-validation/dist/jquery.validate.min.js"></script>
    <script src="assets/js/libs/jquery-validation/dist/additional-methods.min.js"></script>
    <script src="assets/js/core/source/App.js"></script>
    <script src="assets/js/core/source/AppNavigation.js"></script>
    <script src="assets/js/core/source/AppOffcanvas.js"></script>
    <script src="assets/js/core/source/AppCard.js"></script>
    <script src="assets/js/core/source/AppForm.js"></script>
    <script src="assets/js/core/source/AppNavSearch.js"></script>
    <script src="assets/js/core/source/AppVendor.js"></script>
    <script type="text/javascript" src="assets/js/libs/jqwidgets/jqx-all.js"></script>

    <script src="assets/js/core/demo/login.js"></script>
   <%-- <script type="text/javascript" src="https://l2.io/ip.js?var=myip"></script>--%>
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-65330728-1', 'auto');
        ga('send', 'pageview');

    </script>
    <!-- END JAVASCRIPT -->

</body>
</html>
