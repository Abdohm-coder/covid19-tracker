import numeral from "numeral";
import "./Table.css";

function Table({ countries }) {
  return <div className='table' >
      <table>
        <tbody>
            { countries.map(({ country, cases }) => (
                <tr key={`${country}1`}>
                        <td>{ country }</td>
                        <td>
                            <strong>{numeral(cases).format("0.0a") }</strong>
                        </td>
                </tr>
            )) }
        </tbody>
      </table>
  </div>;
}

export default Table;
