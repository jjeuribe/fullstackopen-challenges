function Header({ title }) {
  return (
    <h1>{title}</h1>
  )
}

function Content({ parts }) {
  return (
    <div>
      {parts.map(({ id, name, exercises }) => 
        <Part key={id} name={name} exercises={exercises}/>
      )}
    </div>
  )
}

function Total({ parts }) {
  const totalOfExercises = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <p><b>total of exercises {totalOfExercises}</b></p>
  )
}

function Part({ name, exercises }) {
  return (
    <p>{name} {exercises}</p>
  )
}

function Course({ course }) {
  return (
    <div>
      <Header title={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course