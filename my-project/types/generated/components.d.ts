import type { Attribute, Schema } from '@strapi/strapi';

export interface EcommercePrice extends Schema.Component {
  collectionName: 'components_ecommerce_prices';
  info: {
    description: '\u50F9\u683C\u7D44\u4EF6\uFF0C\u5305\u542B\u539F\u50F9\u3001\u552E\u50F9\u3001\u5E63\u5225\u3001\u4FC3\u92B7\u50F9\u6709\u6548\u671F';
    displayName: 'Price';
    icon: 'dollar-sign';
  };
  attributes: {
    currency: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'TWD'>;
    isOnSale: Attribute.Boolean & Attribute.DefaultTo<false>;
    originalPrice: Attribute.Decimal;
    promoEndDate: Attribute.DateTime;
    promoStartDate: Attribute.DateTime;
    salePrice: Attribute.Decimal & Attribute.Required;
  };
}

export interface SharedAddressBlock extends Schema.Component {
  collectionName: 'components_shared_address_blocks';
  info: {
    description: '\u5730\u5740\u7D44\u4EF6';
    displayName: 'Address Block';
    icon: 'map-pin';
  };
  attributes: {
    addressLine1: Attribute.String & Attribute.Required;
    addressLine2: Attribute.String;
    city: Attribute.String & Attribute.Required;
    country: Attribute.String & Attribute.DefaultTo<'Taiwan'>;
    district: Attribute.String;
    fullName: Attribute.String & Attribute.Required;
    isDefault: Attribute.Boolean & Attribute.DefaultTo<false>;
    phone: Attribute.String & Attribute.Required;
    postalCode: Attribute.String & Attribute.Required;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO \u512A\u5316\u7D44\u4EF6';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Attribute.String;
    metaDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaKeywords: Attribute.String;
    metaTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogDescription: Attribute.Text;
    ogImage: Attribute.Media<'images'>;
    ogTitle: Attribute.String;
    twitterCard: Attribute.Enumeration<
      ['summary', 'summary_large_image', 'app', 'player']
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'ecommerce.price': EcommercePrice;
      'shared.address-block': SharedAddressBlock;
      'shared.seo': SharedSeo;
    }
  }
}
