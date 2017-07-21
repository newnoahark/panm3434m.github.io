<!DOCTYPE html>
<html>
<head>
  <title></title>
  <meta charset="utf-8">
</head>
<body>
<form action="" method="post">
  <input type="text" name="name">
  <input type="submit" name="ok" value="提交">
  <?php echo empty($_COOKIE['mgs']) ? '' :$_COOKIE['mgs'];?>
</form>
</body>
</html>