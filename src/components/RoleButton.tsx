import { Link } from 'react-router-dom';

export const RoleButton = () => (
  <>
    <Link key="junior" className="btn btn--full-row" to="/?role=джун">
      джун
    </Link>
    <Link key="teamlead" className="btn btn--full-row" to="/?role=тимлид">
      тимлид
    </Link>
    <Link key="client" className="btn btn--full-row" to="/?role=заказчик">
      заказчик
    </Link>
  </>
);
