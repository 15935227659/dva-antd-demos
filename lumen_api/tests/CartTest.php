<?php
class Cart
{
    const PRICE_BUTTER  = 1.00;
    const PRICE_MILK    = 3.00;
    const PRICE_EGGS    = 6.95;

    protected $products = array();

    public function add($product, $quantity)
    {
        $this->products[$product] = $quantity;
    }

    public function getQuantity($product)
    {
        return isset($this->products[$product]) ? $products[$product] :
            false;
    }

    public function getTotal($tax)
    {
        $total = 0.00;
        $callback = function($quantity, $product) use ($tax, &$total)
            {
                $pricePerItem = constant(__CLASS__ . "::PRICE_" . strtoupper($product));
                $total += ($pricePerItem * $quantity) * ($tax + 1.0);
            };

        array_walk($this->products, $callback);

        return round($total, 2);
    }
}

$mycart = new Cart;

$mycart->add('butter', 2);
$mycart->add('milk', 3);
$mycart->add('eggs', 4);

print_r($mycart->getTotal(0.05));
echo PHP_EOL;
