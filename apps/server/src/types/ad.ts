export interface iAd {
  id: number;
  url: string;
  last_refresh_time: string;
  title: string;
  promotion: {
    top_ad: boolean;
  };
  params: Array<{
    key: string;
    name: string;
    value: {
      key: string;
      label: string;
    };
  }>;
  location: {
    city: {
      name: string;
    };
  };
}
