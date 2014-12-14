<h1>Inscription</h1>
<?php
echo $this->Form->create('User', array('controller' => 'user', 'action' => 'register'));
echo $this->Form->input('email');
echo $this->Form->input('password');
echo $this->Form->end('Register');
echo $this->Session->flash();
?>
<?php
if ($Auth->loggedIn()) {
    debug($Auth->user());
    echo $this->Form->create('User', array('action' => 'logout'));
    echo $this->Form->end('Logout');
}
?>
<h1>Connexion</h1>
<?php
echo $this->Form->create('User', array('controller' => 'user', 'action' => 'login'));
echo $this->Form->input('email');
echo $this->Form->input('password');
echo $this->Form->end('Connect');
echo $this->Session->flash();
?>
<h1>Note</h1>
<?php
    
?>
