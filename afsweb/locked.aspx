<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="locked.aspx.cs" Inherits="afsweb.locked" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title><%=ConfigurationManager.AppSettings["CIA.NAME"]%> - Locked</title>

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
    <!-- END STYLESHEETS -->

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
		<script type="text/javascript" src="/assets/js/libs/utils/html5shiv.js?1403934957"></script>
		<script type="text/javascript" src="/assets/js/libs/utils/respond.min.js?1403934956"></script>
		<![endif]-->
</head>
<body class="menubar-hoverable header-fixed ">

    <!-- BEGIN LOCKED SECTION -->
    <section class="section-account">
        <div class="img-backdrop" style="background-image: url('assets/img/img16.jpg')"></div>
        <div class="spacer"></div>
        <div class="card contain-xs style-transparent">
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-12">
                        <img class="img-circle" src="assets/img/avatar1.jpg?1403934956" alt="" />
                        <h2><span id="username">Pamela de la Rosa</span></h2>
                        <form class="form" action="dashboard.aspx" accept-charset="utf-8" method="post">
                            <div class="form-group floating-label">
                                <div class="input-group">
                                    <div class="input-group-content">
                                        <input type="password" id="password" class="form-control" name="password">
                                        <label for="password">Password</label>
                                        <p class="help-block"><a href="#">Not <span id="unameno">Usuario</span>?</a></p>
                                    </div>
                                    <div class="input-group-btn">
                                        <button class="btn btn-floating-action btn-primary" type="submit"><i class="fa fa-unlock"></i></button>
                                    </div>
                                </div>
                                <!--end .input-group -->
                            </div>
                            <!--end .form-group -->
                        </form>
                    </div>
                    <!--end .col -->
                </div>
                <!--end .row -->
            </div>
            <!--end .card-body -->
        </div>
        <!--end .card -->
    </section>
    <!-- END LOCKED SECTION -->

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
    <script src="assets/js/core/demo/Demo.js"></script>
    <script src="assets/js/libs/jcookie/jquery.cookie.js"></script>
    <script src="assets/js/core/demo/locked.js"></script>
    <!-- END JAVASCRIPT -->

</body>
</html>
