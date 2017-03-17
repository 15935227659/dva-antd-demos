<?php
class DI
{
    protected $_services = array();

    public function set($name, $service)
    {
        $this->_services[$name] = $service;
    }

    public function get($name)
    {
        $service = $this->_services[$name];

        return $service();
    }
}

class User
{
    private $_username;

    public function __construct($username)
    {
        $this->_username = $username;
    }

    public function getUsername()
    {
        return $this->_username;
    }
}


$di = new DI;

$di->set('zhangsan', function() {
    return new User('张三');
});

$di->set('lisi', function() {
    return new User('李四');
});

echo $di->get('zhangsan')->getUsername() . PHP_EOL;

echo $di->get('lisi')->getUsername() . PHP_EOL;
