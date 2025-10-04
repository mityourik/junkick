import { Link } from 'react-router-dom';

export const RoleButton = () => (
  <>
    <Link key="developer" className="btn btn--full-row" to="/?role=разработчик">
      разработчик
    </Link>
    <Link key="teamlead" className="btn btn--full-row" to="/?role=тимлид">
      тимлид
    </Link>
    <Link key="client" className="btn btn--full-row" to="/?role=заказчик">
      заказчик
    </Link>
  </>
);
