import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link as MuiLink,
  Chip
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { fetchJobs } from "./server-actions/job";
import Link from "next/link";
import { StatusFilter } from "./components/status-filter";
import { CompanyFilter } from "./components/company-filter";

type Props = {
  searchParams: { status?: string; company?: string };
};
function getColor(status: string) {
  if (status == "Rejected") return "error";
  return "default";
}

export default async function Home({ searchParams }: Props) {
  const jobs = await fetchJobs(searchParams.status, searchParams.company);

  return (
    <Stack spacing={2}>
      <h1>Job Search Log</h1>
      <Box sx={{ textAlign: "right" }} mt={4}>
        <Link href="job/new">
          <Button variant="outlined">Add</Button>
        </Link>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Board</TableCell>
            <TableCell>Applied at</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <CompanyFilter />
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <StatusFilter />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableBody>
          {jobs.map((job, index) => (
            <TableRow key={job.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Link href={`/job/${job.id}`}>{job.position}</Link>
              </TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{job.board}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{job.appliedAt}</TableCell>
              <TableCell>
                <MuiLink href={job.link} target="_blank">
                  <OpenInNewIcon />
                </MuiLink>
              </TableCell>
              <TableCell>
                <Chip label={job.status} color={getColor(job.status)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
