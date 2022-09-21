class Product {
  constructor(
    id,
    ownerId,
    title,
    imageUrl,
    description,
    price,
    discount,
    discountedPrice,
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.discount = discount;
    this.discountedPrice =
    discountedPrice + price - (discount / 100) * price;
    }
}

export default Product;
