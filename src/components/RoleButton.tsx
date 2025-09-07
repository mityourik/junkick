import { Link } from 'react-router-dom';

export const RoleButton = () => (
  <>
    <Link className="btn btn--full-row" to="/?role=джун">
      джун
    </Link>
    <Link className="btn btn--full-row" to="/?role=тимлид">
      тимлид
    </Link>
    <Link className="btn btn--full-row" to="/?role=заказчик">
      заказчик
    </Link>
  </>
);
